"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionHealthPolicyConfiguration_1 = require("../connectionhealthpolicy/ConnectionHealthPolicyConfiguration");
var ReconnectionHealthPolicy_1 = require("../connectionhealthpolicy/ReconnectionHealthPolicy");
var SignalStrengthBarsConnectionHealthPolicy_1 = require("../connectionhealthpolicy/SignalStrengthBarsConnectionHealthPolicy");
var UnusableAudioWarningConnectionHealthPolicy_1 = require("../connectionhealthpolicy/UnusableAudioWarningConnectionHealthPolicy");
var Maybe_1 = require("../maybe/Maybe");
var MeetingSessionStatus_1 = require("../meetingsession/MeetingSessionStatus");
var MeetingSessionStatusCode_1 = require("../meetingsession/MeetingSessionStatusCode");
var SignalingClientEventType_1 = require("../signalingclient/SignalingClientEventType");
var AudioLogEvent_1 = require("../statscollector/AudioLogEvent");
var VideoLogEvent_1 = require("../statscollector/VideoLogEvent");
var BaseTask_1 = require("./BaseTask");
/*
 * [[MonitorTask]] monitors connections using SignalingAndMetricsConnectionMonitor.
 */
var MonitorTask = /** @class */ (function (_super) {
    __extends(MonitorTask, _super);
    function MonitorTask(context, initialConnectionHealthData) {
        var _this = _super.call(this, context.logger) || this;
        _this.context = context;
        _this.initialConnectionHealthData = initialConnectionHealthData;
        _this.taskName = 'MonitorTask';
        _this.prevSignalStrength = 1;
        _this.checkAndSendWeakSignalEvent = function (signalStrength) {
            var isCurrentSignalBad = signalStrength < 1;
            var isPrevSignalBad = _this.prevSignalStrength < 1;
            var signalStrengthEventType = isCurrentSignalBad
                ? !isPrevSignalBad
                    ? AudioLogEvent_1.default.RedmicStartLoss
                    : null
                : isPrevSignalBad
                    ? AudioLogEvent_1.default.RedmicEndLoss
                    : null;
            if (signalStrengthEventType) {
                _this.context.statsCollector.logAudioEvent(signalStrengthEventType);
            }
            _this.prevSignalStrength = signalStrength;
        };
        _this.realtimeFatalErrorCallback = function (error) {
            _this.logger.error("realtime error: " + error + ": " + error.stack);
            _this.context.audioVideoController.handleMeetingSessionStatus(new MeetingSessionStatus_1.default(MeetingSessionStatusCode_1.default.RealtimeApiFailed));
        };
        _this.reconnectionHealthPolicy = new ReconnectionHealthPolicy_1.default(context.logger, new ConnectionHealthPolicyConfiguration_1.default(), _this.initialConnectionHealthData.clone());
        _this.unusableAudioWarningHealthPolicy = new UnusableAudioWarningConnectionHealthPolicy_1.default(new ConnectionHealthPolicyConfiguration_1.default(), _this.initialConnectionHealthData.clone());
        _this.signalStrengthBarsHealthPolicy = new SignalStrengthBarsConnectionHealthPolicy_1.default(new ConnectionHealthPolicyConfiguration_1.default(), _this.initialConnectionHealthData.clone());
        return _this;
    }
    MonitorTask.prototype.removeObserver = function () {
        this.context.audioVideoController.removeObserver(this);
        this.context.realtimeController.realtimeUnsubscribeToFatalError(this.realtimeFatalErrorCallback);
        this.context.realtimeController.realtimeUnsubscribeToLocalSignalStrengthChange(this.checkAndSendWeakSignalEvent);
        this.context.signalingClient.removeObserver(this);
    };
    MonitorTask.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.context.removableObservers.push(this);
                this.context.audioVideoController.addObserver(this);
                this.context.realtimeController.realtimeSubscribeToFatalError(this.realtimeFatalErrorCallback);
                this.context.realtimeController.realtimeSubscribeToLocalSignalStrengthChange(this.checkAndSendWeakSignalEvent);
                this.context.connectionMonitor.start();
                this.context.statsCollector.start(this.context.signalingClient, this.context.videoStreamIndex);
                this.context.signalingClient.registerObserver(this);
                return [2 /*return*/];
            });
        });
    };
    MonitorTask.prototype.videoSendHealthDidChange = function (bitrateKbps, packetsPerSecond) {
        if (this.context.videoInputAttachedTimestampMs === 0 ||
            !this.context.videoTileController.hasStartedLocalVideoTile() ||
            !this.context.lastKnownVideoAvailability.canStartLocalVideo) {
            return;
        }
        var tracks = this.context.activeVideoInput !== null ? this.context.activeVideoInput.getTracks() : null;
        if (!tracks || !tracks[0]) {
            return;
        }
        var durationMs = Date.now() - this.context.videoInputAttachedTimestampMs;
        if (packetsPerSecond > 0 || bitrateKbps > 0) {
            this.context.statsCollector.logVideoEvent(VideoLogEvent_1.default.SendingSuccess, this.context.videoDeviceInformation);
            this.context.statsCollector.logLatency('video_start_sending', durationMs, this.context.videoDeviceInformation);
            this.context.videoInputAttachedTimestampMs = 0;
        }
        else if (durationMs > MonitorTask.DEFAULT_TIMEOUT_FOR_START_SENDING_VIDEO_MS) {
            this.context.statsCollector.logVideoEvent(VideoLogEvent_1.default.SendingFailed, this.context.videoDeviceInformation);
            this.context.videoInputAttachedTimestampMs = 0;
        }
    };
    MonitorTask.prototype.videoReceiveBandwidthDidChange = function (newBandwidthKbps, oldBandwidthKbps) {
        if (this.context.videoDownlinkBandwidthPolicy) {
            this.logger.debug(function () {
                return "receiving bandwidth changed from prev=" + oldBandwidthKbps + " Kbps to curr=" + newBandwidthKbps + " Kbps";
            });
            this.context.videoDownlinkBandwidthPolicy.updateAvailableBandwidth(newBandwidthKbps);
            var resubscribeForDownlink = this.context.videoDownlinkBandwidthPolicy.wantsResubscribe();
            if (resubscribeForDownlink) {
                this.context.videosToReceive = this.context.videoDownlinkBandwidthPolicy.chooseSubscriptions();
                this.logger.info("trigger resubscribe for down=" + resubscribeForDownlink + "; videosToReceive=[" + this.context.videosToReceive.array() + "]");
                this.context.audioVideoController.update();
            }
        }
    };
    MonitorTask.prototype.connectionHealthDidChange = function (connectionHealthData) {
        this.reconnectionHealthPolicy.update(connectionHealthData);
        var reconnectionValue = this.reconnectionHealthPolicy.healthIfChanged();
        if (reconnectionValue !== null) {
            this.logger.info("reconnection health is now: " + reconnectionValue);
            if (reconnectionValue === 0) {
                this.context.audioVideoController.handleMeetingSessionStatus(new MeetingSessionStatus_1.default(MeetingSessionStatusCode_1.default.ConnectionHealthReconnect));
            }
        }
        this.unusableAudioWarningHealthPolicy.update(connectionHealthData);
        var unusableAudioWarningValue = this.unusableAudioWarningHealthPolicy.healthIfChanged();
        if (unusableAudioWarningValue !== null) {
            this.logger.info("unusable audio warning is now: " + unusableAudioWarningValue);
            if (unusableAudioWarningValue === 0) {
                if (this.context.videoTileController.haveVideoTilesWithStreams()) {
                    this.context.audioVideoController.forEachObserver(function (observer) {
                        Maybe_1.default.of(observer.connectionDidSuggestStopVideo).map(function (f) { return f.bind(observer)(); });
                    });
                }
                else {
                    this.context.audioVideoController.forEachObserver(function (observer) {
                        Maybe_1.default.of(observer.connectionDidBecomePoor).map(function (f) { return f.bind(observer)(); });
                    });
                }
            }
        }
        this.signalStrengthBarsHealthPolicy.update(connectionHealthData);
        var signalStrengthBarsValue = this.signalStrengthBarsHealthPolicy.healthIfChanged();
        if (signalStrengthBarsValue !== null) {
            this.logger.info("signal strength bars health is now: " + signalStrengthBarsValue);
        }
    };
    MonitorTask.prototype.handleSignalingClientEvent = function (event) {
        if (event.type !== SignalingClientEventType_1.default.ReceivedSignalFrame) {
            return;
        }
        var status = MeetingSessionStatus_1.default.fromSignalFrame(event.message);
        if (status.statusCode() !== MeetingSessionStatusCode_1.default.OK) {
            this.context.audioVideoController.handleMeetingSessionStatus(status);
        }
    };
    MonitorTask.DEFAULT_TIMEOUT_FOR_START_SENDING_VIDEO_MS = 30000;
    return MonitorTask;
}(BaseTask_1.default));
exports.default = MonitorTask;
//# sourceMappingURL=MonitorTask.js.map