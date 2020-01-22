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
var MeetingSessionStatusCode_1 = require("../meetingsession/MeetingSessionStatusCode");
var DefaultSDP_1 = require("../sdp/DefaultSDP");
var BaseTask_1 = require("./BaseTask");
/*
 * [[FinishGatheringICECandidatesTask]] add ice-candidate event handler on peer connection to
 * collect ice candidates and wait for peer connection ice gathering state to complete
 */
var FinishGatheringICECandidatesTask = /** @class */ (function (_super) {
    __extends(FinishGatheringICECandidatesTask, _super);
    function FinishGatheringICECandidatesTask(context, chromeVpnTimeoutMs) {
        if (chromeVpnTimeoutMs === void 0) { chromeVpnTimeoutMs = FinishGatheringICECandidatesTask.CHROME_VPN_TIMEOUT_MS; }
        var _this = _super.call(this, context.logger) || this;
        _this.context = context;
        _this.chromeVpnTimeoutMs = chromeVpnTimeoutMs;
        _this.taskName = 'FinishGatheringICECandidatesTask';
        return _this;
    }
    FinishGatheringICECandidatesTask.prototype.removeEventListener = function () {
        if (this.context.peer) {
            this.context.peer.removeEventListener('icecandidate', this.context.iceCandidateHandler);
        }
    };
    FinishGatheringICECandidatesTask.prototype.cancel = function () {
        var error = new Error("canceling " + this.name());
        // TODO: Remove when the Chrome VPN reconnect bug is fixed.
        // In Chrome, SDK may fail to establish TURN session after VPN reconnect.
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=9097
        if (this.context.browserBehavior.requiresIceCandidateGatheringTimeoutWorkaround()) {
            if (this.chromeVpnTimeoutMs < this.context.meetingSessionConfiguration.connectionTimeoutMs) {
                var duration = Date.now() - this.startTimestampMs;
                if (duration > this.chromeVpnTimeoutMs) {
                    error = new Error("canceling " + this.name() + " due to the meeting status code: " + MeetingSessionStatusCode_1.default.ICEGatheringTimeoutWorkaround);
                }
            }
        }
        this.cancelPromise && this.cancelPromise(error);
    };
    FinishGatheringICECandidatesTask.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.context.peer) {
                            this.logAndThrow("session does not have peer connection; bypass ice gathering");
                        }
                        if (new DefaultSDP_1.default(this.context.peer.localDescription.sdp).hasCandidatesForAllMLines()) {
                            this.context.logger.info('ice gathering already complete; bypass gathering');
                            return [2 /*return*/];
                        }
                        // On video recvonly cases, Safari unified plan has multiple
                        // m=video section connection line of IP 0.0.0.0 which fails previous check
                        // We observe this task time out when there are more than 4 video attendees
                        // The timeout is observed on a duplicate negotiation, which is tracked in #240.
                        // FinishGatheringICECandidatesTask is just a "wait" on "at least one ice candidate"
                        // or "complete" icegatheringstate before we can establish connection.
                        // The "gathering" is completely handled by browsers
                        // TODO: clean up the logic after addressing #240. And deeper investigation on Unified Plan
                        if (this.context.browserBehavior.requiresIceCandidateCompletionBypass() &&
                            this.context.peer.iceGatheringState === 'complete') {
                            this.context.logger.info('safari ice gathering state is complete; bypass gathering');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                _this.cancelPromise = function (error) {
                                    _this.removeEventListener();
                                    reject(error);
                                };
                                _this.context.iceCandidateHandler = function (event) {
                                    _this.context.logger.info("ice candidate: " + (event.candidate ? event.candidate.candidate : '(null)') + " state: " + _this.context.peer.iceGatheringState);
                                    if (event.candidate) {
                                        if (DefaultSDP_1.default.isRTPCandidate(event.candidate.candidate)) {
                                            _this.context.iceCandidates.push(event.candidate);
                                        }
                                        if (_this.context.turnCredentials && _this.context.iceCandidates.length >= 1) {
                                            _this.context.logger.info('gathered at least one relay candidate');
                                            _this.removeEventListener();
                                            resolve();
                                            return;
                                        }
                                    }
                                    // TODO: re-evaluate ice negotiation task
                                    if (_this.context.peer.iceGatheringState === 'complete') {
                                        // if (this.context.peer.iceGatheringState === 'complete') {
                                        _this.context.logger.info('done gathering ice candidates');
                                        _this.removeEventListener();
                                        if (_this.context.iceCandidates.length === 0) {
                                            reject(new Error('no ice candidates were gathered'));
                                        }
                                        else {
                                            resolve();
                                        }
                                    }
                                };
                                // TODO: register listener before SetLocalDescription to avoid race
                                _this.context.peer.addEventListener('icecandidate', _this.context.iceCandidateHandler);
                                _this.startTimestampMs = Date.now();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FinishGatheringICECandidatesTask.CHROME_VPN_TIMEOUT_MS = 5000;
    return FinishGatheringICECandidatesTask;
}(BaseTask_1.default));
exports.default = FinishGatheringICECandidatesTask;
//# sourceMappingURL=FinishGatheringICECandidatesTask.js.map