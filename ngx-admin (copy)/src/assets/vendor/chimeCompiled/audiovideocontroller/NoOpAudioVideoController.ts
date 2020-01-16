// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import FullJitterBackoff from '../backoff/FullJitterBackoff';
import NoOpDeviceController from '../devicecontroller/NoOpDeviceController';
import NoOpDebugLogger from '../logger/NoOpDebugLogger';
import MeetingSessionConfiguration from '../meetingsession/MeetingSessionConfiguration';
import MeetingSessionCredentials from '../meetingsession/MeetingSessionCredentials';
import MeetingSessionURLs from '../meetingsession/MeetingSessionURLs';
import DefaultReconnectController from '../reconnectcontroller/DefaultReconnectController';
import DefaultWebSocketAdapter from '../websocketadapter/DefaultWebSocketAdapter';
import DefaultAudioVideoController from './DefaultAudioVideoController';

export default class NoOpAudioVideoController extends DefaultAudioVideoController {
  constructor(configuration?: MeetingSessionConfiguration) {
    const emptyConfiguration = new MeetingSessionConfiguration();
    emptyConfiguration.meetingId = '';
    emptyConfiguration.credentials = new MeetingSessionCredentials();
    emptyConfiguration.credentials.attendeeId = '';
    emptyConfiguration.credentials.joinToken = '';
    emptyConfiguration.urls = new MeetingSessionURLs();
    emptyConfiguration.urls.turnControlURL = '';
    emptyConfiguration.urls.audioHostURL = '';
    emptyConfiguration.urls.screenViewingURL = '';
    emptyConfiguration.urls.screenDataURL = '';
    emptyConfiguration.urls.screenSharingURL = 'wss://localhost/';
    emptyConfiguration.urls.signalingURL = 'wss://localhost/';
    super(
      configuration ? configuration : emptyConfiguration,
      new NoOpDebugLogger(),
      new DefaultWebSocketAdapter(new NoOpDebugLogger()),
      new NoOpDeviceController(),
      new DefaultReconnectController(0, new FullJitterBackoff(0, 0, 0))
    );
  }

  start(): void {}

  stop(): void {}
}
