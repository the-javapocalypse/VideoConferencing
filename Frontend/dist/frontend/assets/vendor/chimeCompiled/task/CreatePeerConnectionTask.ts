// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import RemovableObserver from '../removableobserver/RemovableObserver';
import VideoTileState from '../videotile/VideoTileState';
import BaseTask from './BaseTask';

/*
 * [[CreatePeerConnectionTask]] sets up the peer connection object.
 */
export default class CreatePeerConnectionTask extends BaseTask implements RemovableObserver {
  protected taskName = 'CreatePeerConnectionTask';

  private removeTrackAddedEventListener: (() => void) | null = null;
  private removeTrackRemovedEventListeners: { [trackId: string]: () => void } = {};

  private readonly trackEvents: string[] = [
    'ended',
    'mute',
    'unmute',
    'isolationchange',
    'overconstrained',
  ];
  private removeVideoTrackEventListeners: { [trackId: string]: (() => void)[] } = {};

  constructor(private context: AudioVideoControllerState) {
    super(context.logger);
  }

  removeObserver(): void {
    this.removeTrackAddedEventListener && this.removeTrackAddedEventListener();
    for (const trackId in this.removeTrackRemovedEventListeners) {
      this.removeTrackRemovedEventListeners[trackId]();
    }
  }

  async run(): Promise<void> {
    this.context.removableObservers.push(this);

    const configuration: RTCConfiguration = {
      iceServers: [
        {
          urls: this.context.turnCredentials.uris,
          username: this.context.turnCredentials.username,
          credential: this.context.turnCredentials.password,
          credentialType: 'password',
        },
      ],
      iceTransportPolicy: 'relay',
    };
    // @ts-ignore
    configuration.sdpSemantics = this.context.browserBehavior.requiresUnifiedPlan()
      ? 'unified-plan'
      : 'plan-b';
    // @ts-ignore
    this.logger.info(`SDP semantics are ${configuration.sdpSemantics}`);

    if (this.context.peer) {
      this.context.logger.info('reusing peer connection');
    } else {
      this.context.logger.info('creating new peer connection');
      this.context.peer = new RTCPeerConnection(configuration);
    }

    this.removeTrackAddedEventListener = () => {
      if (this.context.peer) {
        this.context.peer.removeEventListener('track', this.trackAddedHandler);
      }
      this.removeTrackAddedEventListener = null;
    };
    this.context.peer.addEventListener('track', this.trackAddedHandler);
  }

  private trackAddedHandler = (event: RTCTrackEvent) => {
    const track: MediaStreamTrack = event.track;
    this.context.logger.info(
      `received track event: kind=${track.kind} id=${track.id} label=${track.label}`
    );

    const stream: MediaStream = event.streams[0];
    if (track.kind === 'audio') {
      this.context.audioMixController.bindAudioStream(stream);
    } else if (track.kind === 'video' && !this.trackIsVideoInput(track)) {
      this.addRemoteVideoTrack(track, stream);
    }
  };

  private trackIsVideoInput(track: MediaStreamTrack): boolean {
    if (this.context.transceiverController.useTransceivers()) {
      this.logger.info(`getting video track type (unified-plan)`);
      return this.context.transceiverController.trackIsVideoInput(track);
    }
    this.logger.info(`getting video track type (plan-b)`);
    if (this.context.activeVideoInput) {
      const tracks = this.context.activeVideoInput.getVideoTracks();
      if (tracks && tracks.length > 0 && tracks[0].id === track.id) {
        return true;
      }
    }
    return false;
  }

  private addRemoteVideoTrack(track: MediaStreamTrack, stream: MediaStream): void {
    let trackId = stream.id;
    if (!this.context.browserBehavior.requiresUnifiedPlan()) {
      this.logger.info('redefining MediaStream as track array (plan-b)');
      stream = new MediaStream([track]);
      trackId = track.id;
    }
    const attendeeId = this.context.videoStreamIndex.attendeeIdForTrack(trackId);

    // TODO: in case a previous tile with the same attendee id hasn't been cleaned up
    // we do it here to avoid showing a duplicate tile. We should try to understand
    // why this can happen, so adding a log statement to track this and learn more.
    const tilesRemoved = this.context.videoTileController.removeVideoTilesByAttendeeId(attendeeId);
    if (tilesRemoved.length > 0) {
      this.logger.warn(
        `removing existing tiles ${tilesRemoved} with same attendee id ${attendeeId}`
      );
    }

    const tile = this.context.videoTileController.addVideoTile();
    let streamId: number | null = this.context.videoStreamIndex.streamIdForTrack(trackId);
    if (typeof streamId === 'undefined') {
      this.logger.warn(`stream not found for tile=${tile.id()} track=${trackId}`);
      streamId = null;
    }

    for (let i = 0; i < this.trackEvents.length; i++) {
      const trackEvent: string = this.trackEvents[i];
      const videoTracks = stream.getVideoTracks();
      if (videoTracks && videoTracks.length) {
        const videoTrack: MediaStreamTrack = videoTracks[0];
        const callback: EventListenerOrEventListenerObject = (): void => {
          this.context.logger.info(
            `received the ${trackEvent} event for tile=${tile.id()} id=${
              track.id
            } streamId=${streamId}`
          );
        };
        videoTrack.addEventListener(trackEvent, callback);
        if (!this.removeVideoTrackEventListeners[track.id]) {
          this.removeVideoTrackEventListeners[track.id] = [];
        }
        this.removeVideoTrackEventListeners[track.id].push(() => {
          videoTrack.removeEventListener(trackEvent, callback);
        });
      }
    }

    let width: number;
    let height: number;
    if (track.getCapabilities) {
      const cap: MediaTrackCapabilities = track.getCapabilities();
      width = cap.width as number;
      height = cap.height as number;
    } else {
      const cap: MediaTrackSettings = track.getSettings();
      width = cap.width as number;
      height = cap.height as number;
    }
    tile.bindVideoStream(attendeeId, false, stream, width, height, streamId);
    this.logger.info(
      `video track added, created tile=${tile.id()} track=${trackId} streamId=${streamId}`
    );

    let endEvent = 'removetrack';
    let target: MediaStream = stream;
    if (!this.context.browserBehavior.requiresUnifiedPlan()) {
      this.logger.info('updating end event and target track (plan-b)');
      endEvent = 'ended';
      // @ts-ignore
      target = track;
    }

    const trackRemovedHandler = (): void => this.removeRemoteVideoTrack(track, tile.state());
    this.removeTrackRemovedEventListeners[track.id] = () => {
      target.removeEventListener(endEvent, trackRemovedHandler);
      delete this.removeTrackRemovedEventListeners[track.id];
    };
    target.addEventListener(endEvent, trackRemovedHandler);
  }

  private removeRemoteVideoTrack(track: MediaStreamTrack, tileState: VideoTileState): void {
    this.removeTrackRemovedEventListeners[track.id]();

    for (const removeVideoTrackEventListener of this.removeVideoTrackEventListeners[track.id]) {
      removeVideoTrackEventListener();
    }
    delete this.removeVideoTrackEventListeners[track.id];

    this.logger.info(
      `video track ended, removing tile=${tileState.tileId} id=${track.id} stream=${tileState.streamId}`
    );

    if (tileState.streamId) {
      this.context.videosPaused.remove(tileState.streamId);
    } else {
      this.logger.warn(`no stream found for tile=${tileState.tileId}`);
    }
    this.context.videoTileController.removeVideoTile(tileState.tileId);
  }
}
