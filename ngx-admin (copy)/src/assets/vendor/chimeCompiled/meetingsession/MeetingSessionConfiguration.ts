// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import DefaultBrowserBehavior from '../browserbehavior/DefaultBrowserBehavior';
import ConnectionHealthPolicyConfiguration from '../connectionhealthpolicy/ConnectionHealthPolicyConfiguration';
import ScreenSharingSessionOptions from '../screensharingsession/ScreenSharingSessionOptions';
import MeetingSessionCredentials from './MeetingSessionCredentials';
import MeetingSessionURLs from './MeetingSessionURLs';

/**
 * [[MeetingSessionConfiguration]] contains the information necessary to start
 * a session.
 */
export default class MeetingSessionConfiguration {
  /**
   * The id of the meeting the session is joining.
   */
  meetingId: string | null = null;

  /**
   * The credentials used to authenticate the session.
   */
  credentials: MeetingSessionCredentials | null = null;

  /**
   * The URLs the session uses to reach the meeting service.
   */
  urls: MeetingSessionURLs | null = null;

  /**
   * Maximum amount of time in milliseconds to allow for connecting.
   */
  connectionTimeoutMs: number = 15000;

  /**
   * Maximum amount of time in milliseconds to allow for a screen sharing connection.
   */
  screenSharingTimeoutMs: number = 5000;

  /**
   * Maximum amount of time in milliseconds to allow for a screen viewing connection.
   */
  screenViewingTimeoutMs: number = 5000;

  /**
   * Screen sharing session options.
   */
  screenSharingSessionOptions: ScreenSharingSessionOptions = {};

  /**
   * Configuration for connection health policies: reconnection, unusable audio warning connection,
   * and signal strength bars connection.
   */
  connectionHealthPolicyConfiguration: ConnectionHealthPolicyConfiguration = new ConnectionHealthPolicyConfiguration();

  /**
   * Feature flag to enable WebAudio processing
   */
  enableWebAudio: boolean = false;

  /**
   * Constructs a MeetingSessionConfiguration optionally with a chime:CreateMeeting and
   * chime:CreateAttendee response. You can pass in either a JSON object containing the
   * responses, or a JSON object containing the information in the Meeting and Attendee
   * root-level fields. Examples:
   *
   * ```
   * const configuration = new MeetingSessionConfiguration({
   *   "Meeting": {
   *      "MeetingId": "...",
   *      "MediaPlacement": {
   *        "AudioHostUrl": "...",
   *        "ScreenDataUrl": "...",
   *        "ScreenSharingUrl": "...",
   *        "ScreenViewingUrl": "...",
   *        "SignalingUrl": "...",
   *        "TurnControlUrl": "..."
   *      }
   *    }
   *   }
   * }, {
   *   "Attendee": {
   *     "ExternalUserId": "...",
   *     "AttendeeId": "...",
   *     "JoinToken": "..."
   *   }
   * });
   * ```
   *
   * ```
   * const configuration = new MeetingSessionConfiguration({
   *   "MeetingId": "...",
   *   "MediaPlacement": {
   *     "AudioHostUrl": "...",
   *     "ScreenDataUrl": "...",
   *     "ScreenSharingUrl": "...",
   *     "ScreenViewingUrl": "...",
   *     "SignalingUrl": "...",
   *     "TurnControlUrl": "..."
   *   }
   * }, {
   *   "ExternalUserId": "...",
   *   "AttendeeId": "...",
   *   "JoinToken": "..."
   * });
   * ```
   */
  constructor(createMeetingResponse?: any, createAttendeeResponse?: any) { // eslint-disable-line
    if (createMeetingResponse) {
      if (createMeetingResponse.Meeting) {
        createMeetingResponse = createMeetingResponse.Meeting;
      }
      this.meetingId = createMeetingResponse.MeetingId;
      this.urls = new MeetingSessionURLs();
      this.urls.audioHostURL = createMeetingResponse.MediaPlacement.AudioHostUrl;
      this.urls.screenDataURL = createMeetingResponse.MediaPlacement.ScreenDataUrl;
      this.urls.screenSharingURL = createMeetingResponse.MediaPlacement.ScreenSharingUrl;
      this.urls.screenViewingURL = createMeetingResponse.MediaPlacement.ScreenViewingUrl;
      this.urls.signalingURL = createMeetingResponse.MediaPlacement.SignalingUrl;
      this.urls.turnControlURL = createMeetingResponse.MediaPlacement.TurnControlUrl;
    }
    if (createAttendeeResponse) {
      if (createAttendeeResponse.Attendee) {
        createAttendeeResponse = createAttendeeResponse.Attendee;
      }
      this.credentials = new MeetingSessionCredentials();
      this.credentials.attendeeId = createAttendeeResponse.AttendeeId;
      this.credentials.joinToken = createAttendeeResponse.JoinToken;
    }
    if (new DefaultBrowserBehavior().isFirefox()) {
      this.screenSharingSessionOptions = { bitRate: 384000 };
    }
  }
}
