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
var Maybe_1 = require("../maybe/Maybe");
var MeetingSessionVideoAvailability_1 = require("../meetingsession/MeetingSessionVideoAvailability");
var SignalingClientEventType_1 = require("../signalingclient/SignalingClientEventType");
var SignalingProtocol_js_1 = require("../signalingprotocol/SignalingProtocol.js");
var BaseTask_1 = require("./BaseTask");
/*
 * [[ReceiveVideoStreamIndexTask]] receives [[SdkIndexFrame]] and updates [[VideoUplinkBandwidthPolicy]] and [[VideoDownlinkBandwidthPolicy]].
 */
var ReceiveVideoStreamIndexTask = /** @class */ (function (_super) {
    __extends(ReceiveVideoStreamIndexTask, _super);
    function ReceiveVideoStreamIndexTask(context) {
        var _this = _super.call(this, context.logger) || this;
        _this.context = context;
        _this.taskName = 'ReceiveVideoStreamIndexTask';
        return _this;
    }
    ReceiveVideoStreamIndexTask.prototype.removeObserver = function () {
        this.context.signalingClient.removeObserver(this);
    };
    ReceiveVideoStreamIndexTask.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.handleIndexFrame(this.context.indexFrame);
                this.context.signalingClient.registerObserver(this);
                this.context.removableObservers.push(this);
                return [2 /*return*/];
            });
        });
    };
    ReceiveVideoStreamIndexTask.prototype.handleSignalingClientEvent = function (event) {
        if (event.type !== SignalingClientEventType_1.default.ReceivedSignalFrame ||
            event.message.type !== SignalingProtocol_js_1.SdkSignalFrame.Type.INDEX) {
            return;
        }
        // @ts-ignore: force cast to SdkIndexFrame
        var indexFrame = event.message.index;
        this.context.logger.info("received new index " + JSON.stringify(indexFrame));
        this.handleIndexFrame(indexFrame);
    };
    ReceiveVideoStreamIndexTask.prototype.handleIndexFrame = function (indexFrame) {
        if (!indexFrame) {
            return;
        }
        var _a = this.context, videoStreamIndex = _a.videoStreamIndex, videoDownlinkBandwidthPolicy = _a.videoDownlinkBandwidthPolicy, videoUplinkBandwidthPolicy = _a.videoUplinkBandwidthPolicy;
        videoStreamIndex.integrateIndexFrame(indexFrame);
        videoDownlinkBandwidthPolicy.updateIndex(videoStreamIndex);
        videoUplinkBandwidthPolicy.updateIndex(videoStreamIndex);
        this.resubscribe(videoDownlinkBandwidthPolicy, videoUplinkBandwidthPolicy);
        this.updateVideoAvailability(indexFrame);
        this.handleIndexVideosPausedAtSource();
    };
    ReceiveVideoStreamIndexTask.prototype.resubscribe = function (videoDownlinkBandwidthPolicy, videoUplinkBandwidthPolicy) {
        var resubscribeForDownlink = videoDownlinkBandwidthPolicy.wantsResubscribe();
        var resubscribeForUplink = (this.context.videoDuplexMode === SignalingProtocol_js_1.SdkStreamServiceType.TX ||
            this.context.videoDuplexMode === SignalingProtocol_js_1.SdkStreamServiceType.DUPLEX) &&
            videoUplinkBandwidthPolicy.wantsResubscribe();
        var shouldResubscribe = resubscribeForDownlink || resubscribeForUplink;
        this.logger.info("should resubscribe: " + shouldResubscribe + " (downlink: " + resubscribeForDownlink + " uplink: " + resubscribeForUplink + ")");
        if (!shouldResubscribe) {
            return;
        }
        this.context.videosToReceive = videoDownlinkBandwidthPolicy.chooseSubscriptions();
        this.context.videoCaptureAndEncodeParameters = videoUplinkBandwidthPolicy
            .chooseCaptureAndEncodeParameters()
            .clone();
        this.logger.info("trigger resubscribe for up=" + resubscribeForUplink + " down=" + resubscribeForDownlink + "; videosToReceive=[" + this.context.videosToReceive.array() + "] captureParams=" + JSON.stringify(this.context.videoCaptureAndEncodeParameters));
        this.context.audioVideoController.update();
    };
    ReceiveVideoStreamIndexTask.prototype.updateVideoAvailability = function (indexFrame) {
        if (!this.context.videosToReceive) {
            this.logger.error('videosToReceive must be set in the meeting context.');
            return;
        }
        var videoAvailability = new MeetingSessionVideoAvailability_1.default();
        videoAvailability.remoteVideoAvailable = !this.context.videosToReceive.empty();
        videoAvailability.canStartLocalVideo = !indexFrame.atCapacity;
        if (!this.context.lastKnownVideoAvailability ||
            !this.context.lastKnownVideoAvailability.equal(videoAvailability)) {
            this.context.lastKnownVideoAvailability = videoAvailability.clone();
            this.context.audioVideoController.forEachObserver(function (observer) {
                Maybe_1.default.of(observer.videoAvailabilityDidChange).map(function (f) {
                    return f.bind(observer)(videoAvailability.clone());
                });
            });
        }
    };
    ReceiveVideoStreamIndexTask.prototype.handleIndexVideosPausedAtSource = function () {
        var e_1, _a;
        var streamsPausedAtSource = this.context.videoStreamIndex.streamsPausedAtSource();
        try {
            for (var _b = __values(this.context.videoTileController.getAllVideoTiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tile = _c.value;
                var tileState = tile.state();
                if (streamsPausedAtSource.contain(tileState.streamId)) {
                    if (tile.markPoorConnection()) {
                        this.logger.info("marks the tile " + tileState.tileId + " as having a poor connection");
                    }
                }
                else {
                    if (tile.unmarkPoorConnection()) {
                        this.logger.info("unmarks the tile " + tileState.tileId + " as having a poor connection");
                    }
                }
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
    return ReceiveVideoStreamIndexTask;
}(BaseTask_1.default));
exports.default = ReceiveVideoStreamIndexTask;
//# sourceMappingURL=ReceiveVideoStreamIndexTask.js.map