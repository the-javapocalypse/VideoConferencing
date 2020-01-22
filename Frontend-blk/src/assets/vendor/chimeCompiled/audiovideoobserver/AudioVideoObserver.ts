// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import ClientMetricReport from '../clientmetricreport/ClientMetricReport';
import ConnectionHealthData from '../connectionhealthpolicy/ConnectionHealthData';
import MeetingSessionStatus from '../meetingsession/MeetingSessionStatus';
import MeetingSessionVideoAvailability from '../meetingsession/MeetingSessionVideoAvailability';
import VideoTileState from '../videotile/VideoTileState';

export default interface AudioVideoObserver {
  /**
   * Called when the session is connecting or reconnecting.
   */

  audioVideoDidStartConnecting?(reconnecting: boolean): void;

  /**
   * Called when the session has started.
   */

  audioVideoDidStart?(): void;

  /**
   * Called when the session has stopped from a started state with the reason
   * provided in the status.
   */
  audioVideoDidStop?(sessionStatus: MeetingSessionStatus): void;

  /**
   * Called when the client's audio is muted.
   */
  remoteDidMuteAudio?(): void;

  /**
   * Called when the client's audio is unmuted.
   */
  remoteDidUnmuteAudio?(): void;

  /**
   * Called whenever a tile has been created or updated.
   */
  videoTileDidUpdate?(tileState: VideoTileState): void;

  /**
   * Called whenever a tile has been removed.
   */
  videoTileWasRemoved?(tileId: number): void;

  /**
   * Called when video availability has changed. This information can be used to decide whether to
   * switch the connection type to video and whether or not to offer the option to start the local
   * video tile.
   */
  videoAvailabilityDidChange?(availability: MeetingSessionVideoAvailability): void;

  /**
   * Called when metric of video outbound traffic is received.
   */
  videoSendHealthDidChange?(bitrateKbps: number, packetsPerSecond: number): void;

  /**
   * Called when available video sending bandwidth changed.
   */
  videoSendBandwidthDidChange?(newBandwidthKbps: number, oldBandwidthKbps: number): void;

  /**
   * Called when available video receiving bandwidth changed to trigger video subscription if needed.
   */
  videoReceiveBandwidthDidChange?(newBandwidthKbps: number, oldBandwidthKbps: number): void;

  /**
   * Called when the media stats are available.
   */
  metricsDidReceive?(clientMetricReport: ClientMetricReport): void;

  /**
   * Called when connection health has changed.
   */
  connectionHealthDidChange?(connectionHealthData: ConnectionHealthData): void;

  /**
   * Called when the connection has been poor for a while.
   */
  connectionDidBecomePoor?(): void;

  /**
   * Called when the connection has been poor while using video so that the observer
   * can prompt the user about turning off video.
   */
  connectionDidSuggestStopVideo?(): void;

  /**
   * Called when a user tries to start a video but by the time the backend processes the request,
   * video capacity has been reached and starting local video is not possible. This can be used to
   * trigger a message to the user about the situation.
   */
  videoSendDidBecomeUnavailable?(): void;
}
