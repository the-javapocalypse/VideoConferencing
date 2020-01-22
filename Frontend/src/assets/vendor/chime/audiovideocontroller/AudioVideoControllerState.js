"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[AudioVideoControllerState]] includes the compute resources shared by [[Task]].
 */
var AudioVideoControllerState = /** @class */ (function () {
    function AudioVideoControllerState() {
        this.logger = null;
        this.browserBehavior = null;
        this.signalingClient = null;
        this.meetingSessionConfiguration = null;
        this.peer = null;
        this.sdpOfferInit = null;
        this.audioVideoController = null;
        this.realtimeController = null;
        this.videoTileController = null;
        this.mediaStreamBroker = null;
        this.deviceController = null;
        this.audioMixController = null;
        this.activeAudioInput = null;
        this.activeVideoInput = null;
        this.transceiverController = null;
        this.indexFrame = null;
        this.iceCandidates = [];
        this.iceCandidateHandler = null;
        this.screenSharingSession = null;
        this.sdpAnswer = null;
        this.turnCredentials = null;
        this.reconnectController = null;
        this.removableObservers = [];
        this.videoStreamIndex = null;
        this.videoDownlinkBandwidthPolicy = null;
        this.videoUplinkBandwidthPolicy = null;
        this.lastKnownVideoAvailability = null;
        this.localVideoSender = null;
        this.videoCaptureAndEncodeParameters = null;
        this.videosToReceive = null;
        this.videoSubscriptions = null;
        this.videosPaused = null;
        this.videoDuplexMode = null;
        this.volumeIndicatorAdapter = null;
        this.statsCollector = null;
        this.connectionMonitor = null;
        this.videoInputAttachedTimestampMs = 0;
        this.audioDeviceInformation = {};
        this.videoDeviceInformation = {};
    }
    return AudioVideoControllerState;
}());
exports.default = AudioVideoControllerState;
//# sourceMappingURL=AudioVideoControllerState.js.map