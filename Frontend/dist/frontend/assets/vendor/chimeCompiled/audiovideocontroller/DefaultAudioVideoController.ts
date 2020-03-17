// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import ActiveSpeakerDetector from '../activespeakerdetector/ActiveSpeakerDetector';
import DefaultActiveSpeakerDetector from '../activespeakerdetector/DefaultActiveSpeakerDetector';
import AudioMixController from '../audiomixcontroller/AudioMixController';
import DefaultAudioMixController from '../audiomixcontroller/DefaultAudioMixController';
import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import AudioVideoFacade from '../audiovideofacade/AudioVideoFacade';
import DefaultAudioVideoFacade from '../audiovideofacade/DefaultAudioVideoFacade';
import AudioVideoObserver from '../audiovideoobserver/AudioVideoObserver';
import DefaultBrowserBehavior from '../browserbehavior/DefaultBrowserBehavior';
import ConnectionHealthData from '../connectionhealthpolicy/ConnectionHealthData';
import SignalingAndMetricsConnectionMonitor from '../connectionmonitor/SignalingAndMetricsConnectionMonitor';
import DeviceController from '../devicecontroller/DeviceController';
import Logger from '../logger/Logger';
import Maybe from '../maybe/Maybe';
import DeviceControllerBasedMediaStreamBroker from '../mediastreambroker/DeviceControllerBasedMediaStreamBroker';
import MediaStreamBroker from '../mediastreambroker/MediaStreamBroker';
import MeetingSessionConfiguration from '../meetingsession/MeetingSessionConfiguration';
import MeetingSessionStatus from '../meetingsession/MeetingSessionStatus';
import MeetingSessionStatusCode from '../meetingsession/MeetingSessionStatusCode';
import MeetingSessionVideoAvailability from '../meetingsession/MeetingSessionVideoAvailability';
import DefaultPingPong from '../pingpong/DefaultPingPong';
import DefaultRealtimeController from '../realtimecontroller/DefaultRealtimeController';
import RealtimeController from '../realtimecontroller/RealtimeController';
import ReconnectController from '../reconnectcontroller/ReconnectController';
import AsyncScheduler from '../scheduler/AsyncScheduler';
import DefaultSessionStateController from '../sessionstatecontroller/DefaultSessionStateController';
import SessionStateController from '../sessionstatecontroller/SessionStateController';
import SessionStateControllerAction from '../sessionstatecontroller/SessionStateControllerAction';
import SessionStateControllerState from '../sessionstatecontroller/SessionStateControllerState';
import SessionStateControllerTransitionResult from '../sessionstatecontroller/SessionStateControllerTransitionResult';
import DefaultSignalingClient from '../signalingclient/DefaultSignalingClient';
import { SdkStreamServiceType } from '../signalingprotocol/SignalingProtocol.js';
import DefaultStatsCollector from '../statscollector/DefaultStatsCollector';
import AttachMediaInputTask from '../task/AttachMediaInputTask';
import CleanRestartedSessionTask from '../task/CleanRestartedSessionTask';
import CleanStoppedSessionTask from '../task/CleanStoppedSessionTask';
import CreatePeerConnectionTask from '../task/CreatePeerConnectionTask';
import CreateSDPTask from '../task/CreateSDPTask';
import FinishGatheringICECandidatesTask from '../task/FinishGatheringICECandidatesTask';
import JoinAndReceiveIndexTask from '../task/JoinAndReceiveIndexTask';
import LeaveAndReceiveLeaveAckTask from '../task/LeaveAndReceiveLeaveAckTask';
import ListenForVolumeIndicatorsTask from '../task/ListenForVolumeIndicatorsTask';
import MonitorTask from '../task/MonitorTask';
import OpenSignalingConnectionTask from '../task/OpenSignalingConnectionTask';
import ParallelGroupTask from '../task/ParallelGroupTask';
import ReceiveAudioInputTask from '../task/ReceiveAudioInputTask';
import ReceiveTURNCredentialsTask from '../task/ReceiveTURNCredentialsTask';
import ReceiveVideoInputTask from '../task/ReceiveVideoInputTask';
import ReceiveVideoStreamIndexTask from '../task/ReceiveVideoStreamIndexTask';
import SerialGroupTask from '../task/SerialGroupTask';
import SetLocalDescriptionTask from '../task/SetLocalDescriptionTask';
import SetRemoteDescriptionTask from '../task/SetRemoteDescriptionTask';
import SubscribeAndReceiveSubscribeAckTask from '../task/SubscribeAndReceiveSubscribeAckTask';
import TimeoutTask from '../task/TimeoutTask';
import DefaultTransceiverController from '../transceivercontroller/DefaultTransceiverController';
import DefaultVideoCaptureAndEncodeParameter from '../videocaptureandencodeparameter/DefaultVideoCaptureAndEncodeParameter';
import AllHighestVideoBandwidthPolicy from '../videodownlinkbandwidthpolicy/AllHighestVideoBandwidthPolicy';
import DefaultVideoStreamIdSet from '../videostreamidset/DefaultVideoStreamIdSet';
import DefaultVideoStreamIndex from '../videostreamindex/DefaultVideoStreamIndex';
import DefaultVideoTileController from '../videotilecontroller/DefaultVideoTileController';
import VideoTileController from '../videotilecontroller/VideoTileController';
import DefaultVideoTileFactory from '../videotilefactory/DefaultVideoTileFactory';
import NScaleVideoUplinkBandwidthPolicy from '../videouplinkbandwidthpolicy/NScaleVideoUplinkBandwidthPolicy';
import DefaultVolumeIndicatorAdapter from '../volumeindicatoradapter/DefaultVolumeIndicatorAdapter';
import WebSocketAdapter from '../websocketadapter/WebSocketAdapter';
import AudioVideoControllerState from './AudioVideoControllerState';

export default class DefaultAudioVideoController implements AudioVideoController {
  private _facade: AudioVideoFacade;
  private _logger: Logger;
  private _configuration: MeetingSessionConfiguration;
  private _webSocketAdapter: WebSocketAdapter;
  private _realtimeController: RealtimeController;
  private _activeSpeakerDetector: ActiveSpeakerDetector;
  private _videoTileController: VideoTileController;
  private _deviceController: DeviceControllerBasedMediaStreamBroker;
  private _reconnectController: ReconnectController;
  private _audioMixController: AudioMixController;

  private connectionHealthData = new ConnectionHealthData();
  private observerQueue: Set<AudioVideoObserver> = new Set<AudioVideoObserver>();
  private meetingSessionContext = new AudioVideoControllerState();
  private sessionStateController: SessionStateController;

  private static MIN_VOLUME_DECIBELS = -42;
  private static MAX_VOLUME_DECIBELS = -14;
  private static PING_PONG_INTERVAL_MS = 10000;

  constructor(
    configuration: MeetingSessionConfiguration,
    logger: Logger,
    webSocketAdapter: WebSocketAdapter,
    deviceController: DeviceControllerBasedMediaStreamBroker,
    reconnectController: ReconnectController
  ) {
    this._logger = logger;
    this.sessionStateController = new DefaultSessionStateController(this._logger);
    this._configuration = configuration;
    this._webSocketAdapter = webSocketAdapter;
    this._realtimeController = new DefaultRealtimeController();
    this._realtimeController.realtimeSetLocalAttendeeId(configuration.credentials.attendeeId);
    this._activeSpeakerDetector = new DefaultActiveSpeakerDetector(
      this._realtimeController,
      configuration.credentials.attendeeId,
      this.handleHasBandwidthPriority.bind(this)
    );
    this._deviceController = deviceController;
    this._reconnectController = reconnectController;
    this._videoTileController = new DefaultVideoTileController(
      new DefaultVideoTileFactory(),
      this,
      this._logger
    );
    this._audioMixController = new DefaultAudioMixController();
    this._facade = new DefaultAudioVideoFacade(
      this,
      this._videoTileController,
      this._realtimeController,
      this._audioMixController,
      this._deviceController
    );
    this.meetingSessionContext.logger = this._logger;
  }

  get configuration(): MeetingSessionConfiguration {
    return this._configuration;
  }

  get realtimeController(): RealtimeController {
    return this._realtimeController;
  }

  get activeSpeakerDetector(): ActiveSpeakerDetector {
    return this._activeSpeakerDetector;
  }

  get videoTileController(): VideoTileController {
    return this._videoTileController;
  }

  get audioMixController(): AudioMixController {
    return this._audioMixController;
  }

  get facade(): AudioVideoFacade {
    return this._facade;
  }

  get logger(): Logger {
    return this._logger;
  }

  get rtcPeerConnection(): RTCPeerConnection | null {
    return (this.meetingSessionContext && this.meetingSessionContext.peer) || null;
  }

  get mediaStreamBroker(): MediaStreamBroker {
    return this._deviceController;
  }

  get deviceController(): DeviceController {
    return this._deviceController;
  }

  addObserver(observer: AudioVideoObserver): void {
    this.logger.info('adding meeting observer');
    this.observerQueue.add(observer);
  }

  removeObserver(observer: AudioVideoObserver): void {
    this.logger.info('removing meeting observer');
    this.observerQueue.delete(observer);
  }

  forEachObserver(observerFunc: (observer: AudioVideoObserver) => void): void {
    for (const observer of this.observerQueue) {
      new AsyncScheduler().start(() => {
        if (this.observerQueue.has(observer)) {
          observerFunc(observer);
        }
      });
    }
  }

  start(): void {
    this.sessionStateController.perform(SessionStateControllerAction.Connect, () => {
      this.actionConnect(false);
    });
  }

  private async actionConnect(reconnecting: boolean): Promise<void> {
    this.connectionHealthData.reset();
    this.meetingSessionContext = new AudioVideoControllerState();
    this.meetingSessionContext.logger = this.logger;
    this.meetingSessionContext.browserBehavior = new DefaultBrowserBehavior();
    this.meetingSessionContext.meetingSessionConfiguration = this.configuration;
    this.meetingSessionContext.signalingClient = new DefaultSignalingClient(
      this._webSocketAdapter,
      this.logger
    );
    this.meetingSessionContext.mediaStreamBroker = this._deviceController;
    this.meetingSessionContext.deviceController = this._deviceController;
    this.meetingSessionContext.realtimeController = this._realtimeController;
    this.meetingSessionContext.audioMixController = this._audioMixController;
    this.meetingSessionContext.audioVideoController = this;
    this.meetingSessionContext.transceiverController = new DefaultTransceiverController(
      this.logger
    );
    this.meetingSessionContext.volumeIndicatorAdapter = new DefaultVolumeIndicatorAdapter(
      this.logger,
      this._realtimeController,
      DefaultAudioVideoController.MIN_VOLUME_DECIBELS,
      DefaultAudioVideoController.MAX_VOLUME_DECIBELS
    );
    this.meetingSessionContext.videoTileController = this._videoTileController;
    this.meetingSessionContext.videoStreamIndex = new DefaultVideoStreamIndex(this.logger);
    this.meetingSessionContext.videoDownlinkBandwidthPolicy = new AllHighestVideoBandwidthPolicy(
      this.configuration.credentials.attendeeId
    );
    this.meetingSessionContext.videoUplinkBandwidthPolicy = new NScaleVideoUplinkBandwidthPolicy(
      this.configuration.credentials.attendeeId
    );
    this.meetingSessionContext.lastKnownVideoAvailability = new MeetingSessionVideoAvailability();
    this.meetingSessionContext.videoCaptureAndEncodeParameter = new DefaultVideoCaptureAndEncodeParameter(
      0,
      0,
      0,
      0,
      false
    );
    this.meetingSessionContext.videosToReceive = new DefaultVideoStreamIdSet();
    this.meetingSessionContext.videosPaused = new DefaultVideoStreamIdSet();
    this.meetingSessionContext.statsCollector = new DefaultStatsCollector(this, this.logger);
    this.meetingSessionContext.connectionMonitor = new SignalingAndMetricsConnectionMonitor(
      this,
      this._realtimeController,
      this._videoTileController,
      this.connectionHealthData,
      new DefaultPingPong(
        this.meetingSessionContext.signalingClient,
        DefaultAudioVideoController.PING_PONG_INTERVAL_MS,
        this.logger
      ),
      this.meetingSessionContext.statsCollector
    );
    this.meetingSessionContext.reconnectController = this._reconnectController;
    this.meetingSessionContext.audioDeviceInformation = {};
    this.meetingSessionContext.videoDeviceInformation = {};

    if (!reconnecting) {
      this._reconnectController.reset();
      this.forEachObserver(observer => {
        Maybe.of(observer.audioVideoDidStartConnecting).map(f => f.bind(observer)(false));
      });
    }

    if (this._reconnectController.hasStartedConnectionAttempt()) {
      // This does not reset the reconnect deadline, but declare it's not the first connection.
      this._reconnectController.startedConnectionAttempt(false);
    } else {
      this._reconnectController.startedConnectionAttempt(true);
    }

    try {
      await new SerialGroupTask(this.logger, 'AudioVideoStart', [
        new MonitorTask(
          this.meetingSessionContext,
          this.configuration.connectionHealthPolicyConfiguration,
          this.connectionHealthData
        ),
        new ReceiveAudioInputTask(this.meetingSessionContext),
        new TimeoutTask(
          this.logger,
          new SerialGroupTask(this.logger, 'Media', [
            new ParallelGroupTask(this.logger, 'Setup', [
              new ReceiveTURNCredentialsTask(this.meetingSessionContext),
              new SerialGroupTask(this.logger, 'Signaling', [
                new OpenSignalingConnectionTask(this.meetingSessionContext),
                new ListenForVolumeIndicatorsTask(this.meetingSessionContext),
                new JoinAndReceiveIndexTask(this.meetingSessionContext),
                // TODO: ensure index handler does not race with incoming index update
                new ReceiveVideoStreamIndexTask(this.meetingSessionContext),
              ]),
            ]),
            new SerialGroupTask(this.logger, 'Peer', [
              new CreatePeerConnectionTask(this.meetingSessionContext),
              new AttachMediaInputTask(this.meetingSessionContext),
              new CreateSDPTask(this.meetingSessionContext),
              new SetLocalDescriptionTask(this.meetingSessionContext),
              new FinishGatheringICECandidatesTask(this.meetingSessionContext),
              new SubscribeAndReceiveSubscribeAckTask(this.meetingSessionContext),
              new SetRemoteDescriptionTask(this.meetingSessionContext),
            ]),
          ]),
          this.configuration.connectionTimeoutMs
        ),
      ]).run();
      this.sessionStateController.perform(SessionStateControllerAction.FinishConnecting, () => {
        this.actionFinishConnecting();
      });
    } catch (error) {
      this.sessionStateController.perform(SessionStateControllerAction.Fail, async () => {
        const status = new MeetingSessionStatus(
          this.getMeetingStatusCode(error) || MeetingSessionStatusCode.TaskFailed
        );
        await this.actionDisconnect(status, true);
        if (!this.handleMeetingSessionStatus(status)) {
          this.forEachObserver(observer => {
            Maybe.of(observer.audioVideoDidStop).map(f => f.bind(observer)(status));
          });
        }
      });
    }
    this.connectionHealthData.setConnectionStartTime();
  }

  private actionFinishConnecting(): void {
    this.meetingSessionContext.videoDuplexMode = SdkStreamServiceType.RX;
    this.enforceBandwidthLimitationForSender(
      this.meetingSessionContext.videoCaptureAndEncodeParameter.encodeBitrates()[0]
    );
    this.forEachObserver(observer => {
      Maybe.of(observer.audioVideoDidStart).map(f => f.bind(observer)());
    });
    this._reconnectController.reset();
  }

  stop(): void {
    this.sessionStateController.perform(SessionStateControllerAction.Disconnect, () => {
      this.actionDisconnect(new MeetingSessionStatus(MeetingSessionStatusCode.OK), false);
    });
  }

  private async actionDisconnect(
    status: MeetingSessionStatus,
    reconnecting: boolean
  ): Promise<void> {
    try {
      await new SerialGroupTask(this.logger, 'AudioVideoStop', [
        new TimeoutTask(
          this.logger,
          new LeaveAndReceiveLeaveAckTask(this.meetingSessionContext),
          this.configuration.connectionTimeoutMs
        ),
      ]).run();
    } catch (error) {
      this.logger.info('fail to stop');
    }

    try {
      await new SerialGroupTask(this.logger, 'AudioVideoClean', [
        new TimeoutTask(
          this.logger,
          new CleanStoppedSessionTask(this.meetingSessionContext),
          this.configuration.connectionTimeoutMs
        ),
      ]).run();
    } catch (error) {
      this.logger.info('fail to clean');
    }
    this.sessionStateController.perform(SessionStateControllerAction.FinishDisconnecting, () => {
      if (!reconnecting) {
        this.forEachObserver(observer => {
          Maybe.of(observer.audioVideoDidStop).map(f => f.bind(observer)(status));
        });
      }
    });
  }

  update(): boolean {
    const result = this.sessionStateController.perform(SessionStateControllerAction.Update, () => {
      this.actionUpdate(true);
    });
    return (
      result === SessionStateControllerTransitionResult.Transitioned ||
      result === SessionStateControllerTransitionResult.DeferredTransition
    );
  }

  restartLocalVideo(callback: () => void): boolean {
    const restartVideo = async (): Promise<void> => {
      if (this._videoTileController.hasStartedLocalVideoTile()) {
        this.logger.info('stopping local video tile prior to local video restart');
        this._videoTileController.stopLocalVideoTile();
        this.logger.info('preparing local video restart update');
        await this.actionUpdate(false);
        this.logger.info('starting local video tile for local video restart');
        this._videoTileController.startLocalVideoTile();
      }
      this.logger.info('finalizing local video restart update');
      await this.actionUpdate(true);
      callback();
    };
    const result = this.sessionStateController.perform(SessionStateControllerAction.Update, () => {
      restartVideo();
    });
    return (
      result === SessionStateControllerTransitionResult.Transitioned ||
      result === SessionStateControllerTransitionResult.DeferredTransition
    );
  }

  async restartLocalAudio(callback: () => void): Promise<void> {
    let audioStream: MediaStream | null = null;
    try {
      audioStream = await this.mediaStreamBroker.acquireAudioInputStream();
    } catch (error) {
      this.logger.info('could not acquire audio stream from mediaStreamBroker');
    }
    if (!audioStream || audioStream.getAudioTracks().length < 1) {
      throw new Error('could not acquire audio track');
    }

    this.connectionHealthData.reset();
    this.connectionHealthData.setConnectionStartTime();

    const audioTrack = audioStream.getAudioTracks()[0];
    if (!this.meetingSessionContext || !this.meetingSessionContext.peer) {
      throw new Error('no active meeting and peer connection');
    }
    let replaceTrackSuccess = false;

    if (this.meetingSessionContext.browserBehavior.requiresUnifiedPlan()) {
      replaceTrackSuccess = await this.meetingSessionContext.transceiverController.replaceAudioTrack(
        audioTrack
      );
    } else {
      replaceTrackSuccess = await DefaultTransceiverController.replaceAudioTrackForSender(
        this.meetingSessionContext.localAudioSender,
        audioTrack
      );
    }
    this.meetingSessionContext.activeAudioInput = audioStream;
    callback();
    if (replaceTrackSuccess) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }

  private async actionUpdate(notify: boolean): Promise<void> {
    // TODO: do not block other updates while waiting for video input
    try {
      await new SerialGroupTask(this.logger, 'AudioVideoUpdate', [
        new ReceiveVideoInputTask(this.meetingSessionContext),
        new TimeoutTask(
          this.logger,
          new SerialGroupTask(this.logger, 'UpdateSession', [
            new AttachMediaInputTask(this.meetingSessionContext),
            new CreateSDPTask(this.meetingSessionContext),
            new SetLocalDescriptionTask(this.meetingSessionContext),
            new FinishGatheringICECandidatesTask(this.meetingSessionContext),
            new SubscribeAndReceiveSubscribeAckTask(this.meetingSessionContext),
            new SetRemoteDescriptionTask(this.meetingSessionContext),
          ]),
          this.configuration.connectionTimeoutMs
        ),
      ]).run();

      if (notify) {
        this.sessionStateController.perform(SessionStateControllerAction.FinishUpdating, () => {
          this.actionFinishUpdating();
        });
      }
    } catch (error) {
      this.sessionStateController.perform(SessionStateControllerAction.FinishUpdating, () => {
        this.logger.info('failed to update audio-video session');
        this.handleMeetingSessionStatus(
          new MeetingSessionStatus(
            this.getMeetingStatusCode(error) || MeetingSessionStatusCode.TaskFailed
          )
        );
      });
    }
  }

  private actionFinishUpdating(): void {
    const maxBitrateKbps = this.meetingSessionContext.videoCaptureAndEncodeParameter.encodeBitrates()[0];
    this.enforceBandwidthLimitationForSender(maxBitrateKbps);
    this.logger.info('updated audio-video session');
  }

  reconnect(status: MeetingSessionStatus): boolean {
    const willRetry = this._reconnectController.retryWithBackoff(
      async () => {
        if (this.sessionStateController.state() === SessionStateControllerState.NotConnected) {
          this.sessionStateController.perform(SessionStateControllerAction.Connect, () => {
            this.actionConnect(true);
          });
        } else {
          this.sessionStateController.perform(SessionStateControllerAction.Reconnect, () => {
            this.actionReconnect();
          });
        }
      },
      () => {
        this.logger.info('canceled retry');
      }
    );

    if (!willRetry) {
      this.sessionStateController.perform(SessionStateControllerAction.Fail, () => {
        this.actionDisconnect(status, false);
      });
    }

    return willRetry;
  }

  private async actionReconnect(): Promise<void> {
    if (!this._reconnectController.hasStartedConnectionAttempt()) {
      this._reconnectController.startedConnectionAttempt(false);
      this.forEachObserver(observer => {
        Maybe.of(observer.audioVideoDidStartConnecting).map(f => f.bind(observer)(true));
      });
    }

    this.connectionHealthData.reset();
    try {
      await new SerialGroupTask(this.logger, 'AudioVideoReconnect', [
        new TimeoutTask(
          this.logger,
          new SerialGroupTask(this.logger, 'Media', [
            new CleanRestartedSessionTask(this.meetingSessionContext),
            new ParallelGroupTask(this.logger, 'Setup', [
              new ReceiveTURNCredentialsTask(this.meetingSessionContext),
              new SerialGroupTask(this.logger, 'Signaling', [
                new OpenSignalingConnectionTask(this.meetingSessionContext),
                new JoinAndReceiveIndexTask(this.meetingSessionContext),
              ]),
            ]),
            new CreatePeerConnectionTask(this.meetingSessionContext),
          ]),
          this.configuration.connectionTimeoutMs
        ),
        // TODO: Do we need ReceiveVideoInputTask in the reconnect operation?
        new ReceiveVideoInputTask(this.meetingSessionContext),
        new TimeoutTask(
          this.logger,
          new SerialGroupTask(this.logger, 'UpdateSession', [
            new AttachMediaInputTask(this.meetingSessionContext),
            new CreateSDPTask(this.meetingSessionContext),
            new SetLocalDescriptionTask(this.meetingSessionContext),
            new FinishGatheringICECandidatesTask(this.meetingSessionContext),
            new SubscribeAndReceiveSubscribeAckTask(this.meetingSessionContext),
            new SetRemoteDescriptionTask(this.meetingSessionContext),
          ]),
          this.configuration.connectionTimeoutMs
        ),
      ]).run();

      this.sessionStateController.perform(SessionStateControllerAction.FinishConnecting, () => {
        this.actionFinishConnecting();
      });
    } catch (error) {
      // To perform the "Reconnect" action again, the session should be in the "Connected" state.
      this.sessionStateController.perform(SessionStateControllerAction.FinishConnecting, () => {
        this.logger.info('failed to reconnect audio-video session');
        this.handleMeetingSessionStatus(
          new MeetingSessionStatus(
            this.getMeetingStatusCode(error) || MeetingSessionStatusCode.TaskFailed
          )
        );
      });
    }
    this.connectionHealthData.setConnectionStartTime();
  }

  private getMeetingStatusCode(error: Error): MeetingSessionStatusCode | null {
    const matched = /the meeting status code: (\d+)/.exec(error && error.message);
    if (matched && matched.length > 1) {
      return Number(matched[1]);
    } else {
      return null;
    }
  }

  private enforceBandwidthLimitationForSender(maxBitrateKbps: number): void {
    if (this.meetingSessionContext.browserBehavior.requiresUnifiedPlan()) {
      this.meetingSessionContext.transceiverController.setVideoSendingBitrateKbps(maxBitrateKbps);
    } else {
      DefaultTransceiverController.setVideoSendingBitrateKbpsForSender(
        this.meetingSessionContext.localVideoSender,
        maxBitrateKbps,
        this.meetingSessionContext.logger
      );
    }
  }

  handleMeetingSessionStatus(status: MeetingSessionStatus): boolean {
    this.logger.info(`handling status: ${MeetingSessionStatusCode[status.statusCode()]}`);
    if (!status.isTerminal()) {
      if (this.meetingSessionContext.statsCollector) {
        this.meetingSessionContext.statsCollector.logMeetingSessionStatus(status);
      }
    }
    if (status.statusCode() === MeetingSessionStatusCode.VideoCallSwitchToViewOnly) {
      this._videoTileController.removeLocalVideoTile();
      this.forEachObserver((observer: AudioVideoObserver) => {
        Maybe.of(observer.videoSendDidBecomeUnavailable).map(f => f.bind(observer)());
      });
      return false;
    }
    if (status.isFailure()) {
      this.logger.error(
        `connection failed with status code: ${MeetingSessionStatusCode[status.statusCode()]}`
      );
    }
    if (status.isTerminal()) {
      this.logger.info('session will not be reconnected');
      if (this.meetingSessionContext.reconnectController) {
        this.meetingSessionContext.reconnectController.disableReconnect();
      }
    }
    if (status.isFailure() || status.isTerminal()) {
      if (this.meetingSessionContext.reconnectController) {
        return this.reconnect(status);
      }
    }
    return false;
  }

  setVideoMaxBandwidthKbps(maxBandwidthKbps: number): void {
    if (this.meetingSessionContext && this.meetingSessionContext.videoUplinkBandwidthPolicy) {
      this.logger.info(`video send has ideal max bandwidth ${maxBandwidthKbps} kbps`);
      this.meetingSessionContext.videoUplinkBandwidthPolicy.setIdealMaxBandwidthKbps(
        maxBandwidthKbps
      );
    }
  }

  handleHasBandwidthPriority(hasBandwidthPriority: boolean): void {
    if (this.meetingSessionContext && this.meetingSessionContext.videoUplinkBandwidthPolicy) {
      this.logger.info(`video send has bandwidth priority: ${hasBandwidthPriority}`);
      const oldMaxBandwidth = this.meetingSessionContext.videoUplinkBandwidthPolicy.maxBandwidthKbps();
      this.meetingSessionContext.videoUplinkBandwidthPolicy.setHasBandwidthPriority(
        hasBandwidthPriority
      );
      const newMaxBandwidth = this.meetingSessionContext.videoUplinkBandwidthPolicy.maxBandwidthKbps();
      if (oldMaxBandwidth !== newMaxBandwidth) {
        this.logger.info(
          `video send bandwidth max has changed from ${oldMaxBandwidth} kbps to ${newMaxBandwidth} kbps`
        );
        this.enforceBandwidthLimitationForSender(newMaxBandwidth);
      }
    }
  }
}
