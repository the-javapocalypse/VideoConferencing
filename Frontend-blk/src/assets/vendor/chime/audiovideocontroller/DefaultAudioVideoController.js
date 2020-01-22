"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultActiveSpeakerDetector_1 = require("../activespeakerdetector/DefaultActiveSpeakerDetector");
var DefaultAudioMixController_1 = require("../audiomixcontroller/DefaultAudioMixController");
var DefaultAudioVideoFacade_1 = require("../audiovideofacade/DefaultAudioVideoFacade");
var DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
var ConnectionHealthData_1 = require("../connectionhealthpolicy/ConnectionHealthData");
var SignalingAndMetricsConnectionMonitor_1 = require("../connectionmonitor/SignalingAndMetricsConnectionMonitor");
var Maybe_1 = require("../maybe/Maybe");
var MeetingSessionStatus_1 = require("../meetingsession/MeetingSessionStatus");
var MeetingSessionStatusCode_1 = require("../meetingsession/MeetingSessionStatusCode");
var MeetingSessionVideoAvailability_1 = require("../meetingsession/MeetingSessionVideoAvailability");
var DefaultPingPong_1 = require("../pingpong/DefaultPingPong");
var DefaultRealtimeController_1 = require("../realtimecontroller/DefaultRealtimeController");
var AsyncScheduler_1 = require("../scheduler/AsyncScheduler");
var DefaultSessionStateController_1 = require("../sessionstatecontroller/DefaultSessionStateController");
var SessionStateControllerAction_1 = require("../sessionstatecontroller/SessionStateControllerAction");
var SessionStateControllerState_1 = require("../sessionstatecontroller/SessionStateControllerState");
var SessionStateControllerTransitionResult_1 = require("../sessionstatecontroller/SessionStateControllerTransitionResult");
var DefaultSignalingClient_1 = require("../signalingclient/DefaultSignalingClient");
var SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
var DefaultStatsCollector_1 = require("../statscollector/DefaultStatsCollector");
var AttachMediaInputTask_1 = require("../task/AttachMediaInputTask");
var CleanRestartedSessionTask_1 = require("../task/CleanRestartedSessionTask");
var CleanStoppedSessionTask_1 = require("../task/CleanStoppedSessionTask");
var CreatePeerConnectionTask_1 = require("../task/CreatePeerConnectionTask");
var CreateSDPTask_1 = require("../task/CreateSDPTask");
var FinishGatheringICECandidatesTask_1 = require("../task/FinishGatheringICECandidatesTask");
var JoinAndReceiveIndexTask_1 = require("../task/JoinAndReceiveIndexTask");
var LeaveAndReceiveLeaveAckTask_1 = require("../task/LeaveAndReceiveLeaveAckTask");
var ListenForVolumeIndicatorsTask_1 = require("../task/ListenForVolumeIndicatorsTask");
var MonitorTask_1 = require("../task/MonitorTask");
var OpenSignalingConnectionTask_1 = require("../task/OpenSignalingConnectionTask");
var ParallelGroupTask_1 = require("../task/ParallelGroupTask");
var ReceiveAudioInputTask_1 = require("../task/ReceiveAudioInputTask");
var ReceiveTURNCredentialsTask_1 = require("../task/ReceiveTURNCredentialsTask");
var ReceiveVideoInputTask_1 = require("../task/ReceiveVideoInputTask");
var ReceiveVideoStreamIndexTask_1 = require("../task/ReceiveVideoStreamIndexTask");
var SerialGroupTask_1 = require("../task/SerialGroupTask");
var SetLocalDescriptionTask_1 = require("../task/SetLocalDescriptionTask");
var SetRemoteDescriptionTask_1 = require("../task/SetRemoteDescriptionTask");
var SubscribeAndReceiveSubscribeAckTask_1 = require("../task/SubscribeAndReceiveSubscribeAckTask");
var TimeoutTask_1 = require("../task/TimeoutTask");
var DefaultTransceiverController_1 = require("../transceivercontroller/DefaultTransceiverController");
var AllHighestVideoBandwidthPolicy_1 = require("../videodownlinkbandwidthpolicy/AllHighestVideoBandwidthPolicy");
var DefaultVideoStreamIdSet_1 = require("../videostreamidset/DefaultVideoStreamIdSet");
var DefaultVideoStreamIndex_1 = require("../videostreamindex/DefaultVideoStreamIndex");
var DefaultVideoTileController_1 = require("../videotilecontroller/DefaultVideoTileController");
var DefaultVideoTileFactory_1 = require("../videotilefactory/DefaultVideoTileFactory");
var NScaleVideoUplinkBandwidthPolicy_1 = require("../videouplinkbandwidthpolicy/NScaleVideoUplinkBandwidthPolicy");
var VideoCaptureAndEncodeParameters_1 = require("../videouplinkbandwidthpolicy/VideoCaptureAndEncodeParameters");
var DefaultVolumeIndicatorAdapter_1 = require("../volumeindicatoradapter/DefaultVolumeIndicatorAdapter");
var AudioVideoControllerState_1 = require("./AudioVideoControllerState");
var DefaultAudioVideoController = /** @class */ (function () {
    function DefaultAudioVideoController(configuration, logger, webSocketAdapter, deviceController, reconnectController) {
        this.connectionHealthData = new ConnectionHealthData_1.default();
        this.observerQueue = new Set();
        this.meetingSessionContext = new AudioVideoControllerState_1.default();
        this._logger = logger;
        this.sessionStateController = new DefaultSessionStateController_1.default(this._logger);
        this._configuration = configuration;
        this._webSocketAdapter = webSocketAdapter;
        this._realtimeController = new DefaultRealtimeController_1.default();
        this._realtimeController.realtimeSetLocalAttendeeId(configuration.credentials.attendeeId);
        this._activeSpeakerDetector = new DefaultActiveSpeakerDetector_1.default(this._realtimeController, configuration.credentials.attendeeId, this.handleHasBandwidthPriority.bind(this));
        this._deviceController = deviceController;
        this._reconnectController = reconnectController;
        this._videoTileController = new DefaultVideoTileController_1.default(new DefaultVideoTileFactory_1.default(), this, this._logger);
        this._audioMixController = new DefaultAudioMixController_1.default();
        this._facade = new DefaultAudioVideoFacade_1.default(this, this._videoTileController, this._realtimeController, this._audioMixController, this._deviceController);
    }
    Object.defineProperty(DefaultAudioVideoController.prototype, "configuration", {
        get: function () {
            return this._configuration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultAudioVideoController.prototype, "realtimeController", {
        get: function () {
            return this._realtimeController;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultAudioVideoController.prototype, "activeSpeakerDetector", {
        get: function () {
            return this._activeSpeakerDetector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultAudioVideoController.prototype, "videoTileController", {
        get: function () {
            return this._videoTileController;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultAudioVideoController.prototype, "audioMixController", {
        get: function () {
            return this._audioMixController;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultAudioVideoController.prototype, "facade", {
        get: function () {
            return this._facade;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultAudioVideoController.prototype, "logger", {
        get: function () {
            return this._logger;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultAudioVideoController.prototype, "rtcPeerConnection", {
        get: function () {
            return (this.meetingSessionContext && this.meetingSessionContext.peer) || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultAudioVideoController.prototype, "mediaStreamBroker", {
        get: function () {
            return this._deviceController;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultAudioVideoController.prototype, "deviceController", {
        get: function () {
            return this._deviceController;
        },
        enumerable: true,
        configurable: true
    });
    DefaultAudioVideoController.prototype.addObserver = function (observer) {
        this.logger.info('adding meeting observer');
        this.observerQueue.add(observer);
    };
    DefaultAudioVideoController.prototype.removeObserver = function (observer) {
        this.logger.info('removing meeting observer');
        this.observerQueue.delete(observer);
    };
    DefaultAudioVideoController.prototype.forEachObserver = function (observerFunc) {
        var e_1, _a;
        var _this = this;
        var _loop_1 = function (observer) {
            new AsyncScheduler_1.default().start(function () {
                if (_this.observerQueue.has(observer)) {
                    observerFunc(observer);
                }
            });
        };
        try {
            for (var _b = __values(this.observerQueue), _c = _b.next(); !_c.done; _c = _b.next()) {
                var observer = _c.value;
                _loop_1(observer);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    DefaultAudioVideoController.prototype.start = function () {
        var _this = this;
        this.sessionStateController.perform(SessionStateControllerAction_1.default.Connect, function () {
            _this.actionConnect(false);
        });
    };
    DefaultAudioVideoController.prototype.actionConnect = function (reconnecting) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.meetingSessionContext = new AudioVideoControllerState_1.default();
                        this.meetingSessionContext.logger = this.logger;
                        this.meetingSessionContext.browserBehavior = new DefaultBrowserBehavior_1.default();
                        this.meetingSessionContext.meetingSessionConfiguration = this.configuration;
                        this.meetingSessionContext.signalingClient = new DefaultSignalingClient_1.default(this._webSocketAdapter, this.logger);
                        this.meetingSessionContext.mediaStreamBroker = this._deviceController;
                        this.meetingSessionContext.deviceController = this._deviceController;
                        this.meetingSessionContext.realtimeController = this._realtimeController;
                        this.meetingSessionContext.audioMixController = this._audioMixController;
                        this.meetingSessionContext.audioVideoController = this;
                        this.meetingSessionContext.transceiverController = new DefaultTransceiverController_1.default(this.logger);
                        this.meetingSessionContext.volumeIndicatorAdapter = new DefaultVolumeIndicatorAdapter_1.default(this.logger, this._realtimeController, DefaultAudioVideoController.MIN_VOLUME_DECIBELS, DefaultAudioVideoController.MAX_VOLUME_DECIBELS);
                        this.meetingSessionContext.videoTileController = this._videoTileController;
                        this.meetingSessionContext.videoStreamIndex = new DefaultVideoStreamIndex_1.default(this.logger);
                        this.meetingSessionContext.videoDownlinkBandwidthPolicy = new AllHighestVideoBandwidthPolicy_1.default(this.configuration.credentials.attendeeId);
                        this.meetingSessionContext.videoUplinkBandwidthPolicy = new NScaleVideoUplinkBandwidthPolicy_1.default(this.configuration.credentials.attendeeId);
                        this.meetingSessionContext.lastKnownVideoAvailability = new MeetingSessionVideoAvailability_1.default();
                        this.meetingSessionContext.videoCaptureAndEncodeParameters = new VideoCaptureAndEncodeParameters_1.default();
                        this.meetingSessionContext.videosToReceive = new DefaultVideoStreamIdSet_1.default();
                        this.meetingSessionContext.videosPaused = new DefaultVideoStreamIdSet_1.default();
                        this.meetingSessionContext.statsCollector = new DefaultStatsCollector_1.default(this, this.logger);
                        this.meetingSessionContext.connectionMonitor = new SignalingAndMetricsConnectionMonitor_1.default(this, this._realtimeController, this._videoTileController, this.connectionHealthData, new DefaultPingPong_1.default(this.meetingSessionContext.signalingClient, DefaultAudioVideoController.PING_PONG_INTERVAL_MS, this.logger), this.meetingSessionContext.statsCollector);
                        this.meetingSessionContext.reconnectController = this._reconnectController;
                        this.meetingSessionContext.audioDeviceInformation = {};
                        this.meetingSessionContext.videoDeviceInformation = {};
                        if (!reconnecting) {
                            this._reconnectController.reset();
                            this.forEachObserver(function (observer) {
                                Maybe_1.default.of(observer.audioVideoDidStartConnecting).map(function (f) { return f.bind(observer)(false); });
                            });
                        }
                        if (this._reconnectController.hasStartedConnectionAttempt()) {
                            // This does not reset the reconnect deadline, but declare it's not the first connection.
                            this._reconnectController.startedConnectionAttempt(false);
                        }
                        else {
                            this._reconnectController.startedConnectionAttempt(true);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new SerialGroupTask_1.default(this.logger, 'AudioVideoStart', [
                                new MonitorTask_1.default(this.meetingSessionContext, this.connectionHealthData),
                                new ReceiveAudioInputTask_1.default(this.meetingSessionContext),
                                new TimeoutTask_1.default(this.logger, new SerialGroupTask_1.default(this.logger, 'Media', [
                                    new ParallelGroupTask_1.default(this.logger, 'Setup', [
                                        new ReceiveTURNCredentialsTask_1.default(this.meetingSessionContext),
                                        new SerialGroupTask_1.default(this.logger, 'Signaling', [
                                            new OpenSignalingConnectionTask_1.default(this.meetingSessionContext),
                                            new ListenForVolumeIndicatorsTask_1.default(this.meetingSessionContext),
                                            new JoinAndReceiveIndexTask_1.default(this.meetingSessionContext),
                                            // TODO: ensure index handler does not race with incoming index update
                                            new ReceiveVideoStreamIndexTask_1.default(this.meetingSessionContext),
                                        ]),
                                    ]),
                                    new SerialGroupTask_1.default(this.logger, 'Peer', [
                                        new CreatePeerConnectionTask_1.default(this.meetingSessionContext),
                                        new AttachMediaInputTask_1.default(this.meetingSessionContext),
                                        new CreateSDPTask_1.default(this.meetingSessionContext),
                                        new SetLocalDescriptionTask_1.default(this.meetingSessionContext),
                                        new FinishGatheringICECandidatesTask_1.default(this.meetingSessionContext),
                                        new SubscribeAndReceiveSubscribeAckTask_1.default(this.meetingSessionContext),
                                        new SetRemoteDescriptionTask_1.default(this.meetingSessionContext),
                                    ]),
                                ]), this.configuration.connectionTimeoutMs),
                            ]).run()];
                    case 2:
                        _a.sent();
                        this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishConnecting, function () {
                            _this.actionFinishConnecting();
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.sessionStateController.perform(SessionStateControllerAction_1.default.Fail, function () { return __awaiter(_this, void 0, void 0, function () {
                            var status;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        status = new MeetingSessionStatus_1.default(this.getMeetingStatusCode(error_1) || MeetingSessionStatusCode_1.default.TaskFailed);
                                        return [4 /*yield*/, this.actionDisconnect(status, true)];
                                    case 1:
                                        _a.sent();
                                        if (!this.handleMeetingSessionStatus(status)) {
                                            this.forEachObserver(function (observer) {
                                                Maybe_1.default.of(observer.audioVideoDidStop).map(function (f) { return f.bind(observer)(status); });
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DefaultAudioVideoController.prototype.actionFinishConnecting = function () {
        this.meetingSessionContext.videoDuplexMode = SignalingProtocol_js_1.SdkStreamServiceType.RX;
        this.enforceBandwidthLimitationForSender(this.meetingSessionContext.videoCaptureAndEncodeParameters.maxEncodeBitrateKbps);
        this.forEachObserver(function (observer) {
            Maybe_1.default.of(observer.audioVideoDidStart).map(function (f) { return f.bind(observer)(); });
        });
        this._reconnectController.reset();
    };
    DefaultAudioVideoController.prototype.stop = function () {
        var _this = this;
        this.sessionStateController.perform(SessionStateControllerAction_1.default.Disconnect, function () {
            _this.actionDisconnect(new MeetingSessionStatus_1.default(MeetingSessionStatusCode_1.default.OK), false);
        });
    };
    DefaultAudioVideoController.prototype.actionDisconnect = function (status, reconnecting) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2, error_3;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new SerialGroupTask_1.default(this.logger, 'AudioVideoStop', [
                                new TimeoutTask_1.default(this.logger, new LeaveAndReceiveLeaveAckTask_1.default(this.meetingSessionContext), this.configuration.connectionTimeoutMs),
                            ]).run()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        this.logger.info('fail to stop');
                        return [3 /*break*/, 3];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, new SerialGroupTask_1.default(this.logger, 'AudioVideoClean', [
                                new TimeoutTask_1.default(this.logger, new CleanStoppedSessionTask_1.default(this.meetingSessionContext), this.configuration.connectionTimeoutMs),
                            ]).run()];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        this.logger.info('fail to clean');
                        return [3 /*break*/, 6];
                    case 6:
                        this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishDisconnecting, function () {
                            if (!reconnecting) {
                                _this.forEachObserver(function (observer) {
                                    Maybe_1.default.of(observer.audioVideoDidStop).map(function (f) { return f.bind(observer)(status); });
                                });
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    DefaultAudioVideoController.prototype.update = function () {
        var _this = this;
        var result = this.sessionStateController.perform(SessionStateControllerAction_1.default.Update, function () {
            _this.actionUpdate(true);
        });
        return (result === SessionStateControllerTransitionResult_1.default.Transitioned ||
            result === SessionStateControllerTransitionResult_1.default.DeferredTransition);
    };
    DefaultAudioVideoController.prototype.restartLocalVideo = function (callback) {
        var _this = this;
        var restartVideo = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._videoTileController.hasStartedLocalVideoTile()) return [3 /*break*/, 2];
                        this.logger.info('stopping local video tile prior to local video restart');
                        this._videoTileController.stopLocalVideoTile();
                        this.logger.info('preparing local video restart update');
                        return [4 /*yield*/, this.actionUpdate(false)];
                    case 1:
                        _a.sent();
                        this.logger.info('starting local video tile for local video restart');
                        this._videoTileController.startLocalVideoTile();
                        _a.label = 2;
                    case 2:
                        this.logger.info('finalizing local video restart update');
                        return [4 /*yield*/, this.actionUpdate(true)];
                    case 3:
                        _a.sent();
                        callback();
                        return [2 /*return*/];
                }
            });
        }); };
        var result = this.sessionStateController.perform(SessionStateControllerAction_1.default.Update, function () {
            restartVideo();
        });
        return (result === SessionStateControllerTransitionResult_1.default.Transitioned ||
            result === SessionStateControllerTransitionResult_1.default.DeferredTransition);
    };
    DefaultAudioVideoController.prototype.actionUpdate = function (notify) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, new SerialGroupTask_1.default(this.logger, 'AudioVideoUpdate', [
                                new ReceiveVideoInputTask_1.default(this.meetingSessionContext),
                                new TimeoutTask_1.default(this.logger, new SerialGroupTask_1.default(this.logger, 'UpdateSession', [
                                    new AttachMediaInputTask_1.default(this.meetingSessionContext),
                                    new CreateSDPTask_1.default(this.meetingSessionContext),
                                    new SetLocalDescriptionTask_1.default(this.meetingSessionContext),
                                    new FinishGatheringICECandidatesTask_1.default(this.meetingSessionContext),
                                    new SubscribeAndReceiveSubscribeAckTask_1.default(this.meetingSessionContext),
                                    new SetRemoteDescriptionTask_1.default(this.meetingSessionContext),
                                ]), this.configuration.connectionTimeoutMs),
                            ]).run()];
                    case 1:
                        _a.sent();
                        if (notify) {
                            this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishUpdating, function () {
                                _this.actionFinishUpdating();
                            });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishUpdating, function () {
                            _this.logger.info('failed to update audio-video session');
                            _this.handleMeetingSessionStatus(new MeetingSessionStatus_1.default(_this.getMeetingStatusCode(error_4) || MeetingSessionStatusCode_1.default.TaskFailed));
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DefaultAudioVideoController.prototype.actionFinishUpdating = function () {
        var maxBitrateKbps = this.meetingSessionContext.videoCaptureAndEncodeParameters
            .maxEncodeBitrateKbps;
        this.enforceBandwidthLimitationForSender(maxBitrateKbps);
        this.logger.info('updated audio-video session');
    };
    DefaultAudioVideoController.prototype.reconnect = function (status) {
        var _this = this;
        var willRetry = this._reconnectController.retryWithBackoff(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.sessionStateController.state() === SessionStateControllerState_1.default.NotConnected) {
                    this.sessionStateController.perform(SessionStateControllerAction_1.default.Connect, function () {
                        _this.actionConnect(true);
                    });
                }
                else {
                    this.sessionStateController.perform(SessionStateControllerAction_1.default.Reconnect, function () {
                        _this.actionReconnect();
                    });
                }
                return [2 /*return*/];
            });
        }); }, function () {
            _this.logger.info('canceled retry');
        });
        if (!willRetry) {
            this.sessionStateController.perform(SessionStateControllerAction_1.default.Fail, function () {
                _this.actionDisconnect(status, false);
            });
        }
        return willRetry;
    };
    DefaultAudioVideoController.prototype.actionReconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_5;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._reconnectController.hasStartedConnectionAttempt()) {
                            this._reconnectController.startedConnectionAttempt(false);
                            this.forEachObserver(function (observer) {
                                Maybe_1.default.of(observer.audioVideoDidStartConnecting).map(function (f) { return f.bind(observer)(true); });
                            });
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new SerialGroupTask_1.default(this.logger, 'AudioVideoReconnect', [
                                new TimeoutTask_1.default(this.logger, new SerialGroupTask_1.default(this.logger, 'Media', [
                                    new CleanRestartedSessionTask_1.default(this.meetingSessionContext),
                                    new ParallelGroupTask_1.default(this.logger, 'Setup', [
                                        new ReceiveTURNCredentialsTask_1.default(this.meetingSessionContext),
                                        new SerialGroupTask_1.default(this.logger, 'Signaling', [
                                            new OpenSignalingConnectionTask_1.default(this.meetingSessionContext),
                                            new JoinAndReceiveIndexTask_1.default(this.meetingSessionContext),
                                        ]),
                                    ]),
                                    new CreatePeerConnectionTask_1.default(this.meetingSessionContext),
                                ]), this.configuration.connectionTimeoutMs),
                                // TODO: Do we need ReceiveVideoInputTask in the reconnect operation?
                                new ReceiveVideoInputTask_1.default(this.meetingSessionContext),
                                new TimeoutTask_1.default(this.logger, new SerialGroupTask_1.default(this.logger, 'UpdateSession', [
                                    new AttachMediaInputTask_1.default(this.meetingSessionContext),
                                    new CreateSDPTask_1.default(this.meetingSessionContext),
                                    new SetLocalDescriptionTask_1.default(this.meetingSessionContext),
                                    new FinishGatheringICECandidatesTask_1.default(this.meetingSessionContext),
                                    new SubscribeAndReceiveSubscribeAckTask_1.default(this.meetingSessionContext),
                                    new SetRemoteDescriptionTask_1.default(this.meetingSessionContext),
                                ]), this.configuration.connectionTimeoutMs),
                            ]).run()];
                    case 2:
                        _a.sent();
                        this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishConnecting, function () {
                            _this.actionFinishConnecting();
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        // To perform the "Reconnect" action again, the session should be in the "Connected" state.
                        this.sessionStateController.perform(SessionStateControllerAction_1.default.FinishConnecting, function () {
                            _this.logger.info('failed to reconnect audio-video session');
                            _this.handleMeetingSessionStatus(new MeetingSessionStatus_1.default(_this.getMeetingStatusCode(error_5) || MeetingSessionStatusCode_1.default.TaskFailed));
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DefaultAudioVideoController.prototype.getMeetingStatusCode = function (error) {
        var matched = /the meeting status code: (\d+)/.exec(error && error.message);
        if (matched && matched.length > 1) {
            return Number(matched[1]);
        }
        else {
            return null;
        }
    };
    DefaultAudioVideoController.prototype.enforceBandwidthLimitationForSender = function (maxBitrateKbps) {
        if (this.meetingSessionContext.browserBehavior.requiresUnifiedPlan()) {
            this.meetingSessionContext.transceiverController.setVideoSendingBitrateKbps(maxBitrateKbps);
        }
        else {
            DefaultTransceiverController_1.default.setVideoSendingBitrateKbpsForSender(this.meetingSessionContext.localVideoSender, maxBitrateKbps, this.meetingSessionContext.logger);
        }
    };
    DefaultAudioVideoController.prototype.handleMeetingSessionStatus = function (status) {
        this.logger.info("handling status: " + MeetingSessionStatusCode_1.default[status.statusCode()]);
        if (!status.isTerminal()) {
            if (this.meetingSessionContext.statsCollector) {
                this.meetingSessionContext.statsCollector.logMeetingSessionStatus(status);
            }
        }
        if (status.statusCode() === MeetingSessionStatusCode_1.default.VideoCallSwitchToViewOnly) {
            this._videoTileController.removeLocalVideoTile();
            this.forEachObserver(function (observer) {
                Maybe_1.default.of(observer.videoSendDidBecomeUnavailable).map(function (f) { return f.bind(observer)(); });
            });
            return false;
        }
        if (status.isFailure()) {
            this.logger.error("connection failed with status code: " + MeetingSessionStatusCode_1.default[status.statusCode()]);
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
    };
    DefaultAudioVideoController.prototype.setVideoMaxBandwidthKbps = function (maxBandwidthKbps) {
        if (this.meetingSessionContext && this.meetingSessionContext.videoUplinkBandwidthPolicy) {
            this.logger.info("video send has ideal max bandwidth " + maxBandwidthKbps + " kbps");
            this.meetingSessionContext.videoUplinkBandwidthPolicy.setIdealMaxBandwidthKbps(maxBandwidthKbps);
        }
    };
    DefaultAudioVideoController.prototype.handleHasBandwidthPriority = function (hasBandwidthPriority) {
        if (this.meetingSessionContext && this.meetingSessionContext.videoUplinkBandwidthPolicy) {
            this.logger.info("video send has bandwidth priority: " + hasBandwidthPriority);
            var oldMaxBandwidth = this.meetingSessionContext.videoUplinkBandwidthPolicy.maxBandwidthKbps();
            this.meetingSessionContext.videoUplinkBandwidthPolicy.setHasBandwidthPriority(hasBandwidthPriority);
            var newMaxBandwidth = this.meetingSessionContext.videoUplinkBandwidthPolicy.maxBandwidthKbps();
            if (oldMaxBandwidth !== newMaxBandwidth) {
                this.logger.info("video send bandwidth max has changed from " + oldMaxBandwidth + " kbps to " + newMaxBandwidth + " kbps");
                this.enforceBandwidthLimitationForSender(newMaxBandwidth);
            }
        }
    };
    DefaultAudioVideoController.MIN_VOLUME_DECIBELS = -42;
    DefaultAudioVideoController.MAX_VOLUME_DECIBELS = -14;
    DefaultAudioVideoController.PING_PONG_INTERVAL_MS = 10000;
    return DefaultAudioVideoController;
}());
exports.default = DefaultAudioVideoController;
//# sourceMappingURL=DefaultAudioVideoController.js.map