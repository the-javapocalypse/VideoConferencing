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
var BaseTask_1 = require("./BaseTask");
/*
 * [[CreatePeerConnectionTask]] sets up the peer connection object.
 */
var CreatePeerConnectionTask = /** @class */ (function (_super) {
    __extends(CreatePeerConnectionTask, _super);
    function CreatePeerConnectionTask(context) {
        var _this = _super.call(this, context.logger) || this;
        _this.context = context;
        _this.taskName = 'CreatePeerConnectionTask';
        _this.removeTrackAddedEventListener = null;
        _this.removeTrackRemovedEventListeners = {};
        _this.trackEvents = [
            'ended',
            'mute',
            'unmute',
            'isolationchange',
            'overconstrained',
        ];
        _this.removeVideoTrackEventListeners = {};
        _this.trackAddedHandler = function (event) {
            var track = event.track;
            _this.context.logger.info("received track event: kind=" + track.kind + " id=" + track.id + " label=" + track.label);
            var stream = event.streams[0];
            if (track.kind === 'audio') {
                _this.context.audioMixController.bindAudioStream(stream);
            }
            else if (track.kind === 'video' && !_this.trackIsVideoInput(track)) {
                _this.addRemoteVideoTrack(track, stream);
            }
        };
        return _this;
    }
    CreatePeerConnectionTask.prototype.removeObserver = function () {
        this.removeTrackAddedEventListener && this.removeTrackAddedEventListener();
        for (var trackId in this.removeTrackRemovedEventListeners) {
            this.removeTrackRemovedEventListeners[trackId]();
        }
    };
    CreatePeerConnectionTask.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var configuration;
            var _this = this;
            return __generator(this, function (_a) {
                this.context.removableObservers.push(this);
                configuration = {
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
                this.logger.info("SDP semantics are " + configuration.sdpSemantics);
                if (this.context.peer) {
                    this.context.logger.info('reusing peer connection');
                }
                else {
                    this.context.logger.info('creating new peer connection');
                    this.context.peer = new RTCPeerConnection(configuration);
                }
                this.removeTrackAddedEventListener = function () {
                    if (_this.context.peer) {
                        _this.context.peer.removeEventListener('track', _this.trackAddedHandler);
                    }
                    _this.removeTrackAddedEventListener = null;
                };
                this.context.peer.addEventListener('track', this.trackAddedHandler);
                return [2 /*return*/];
            });
        });
    };
    CreatePeerConnectionTask.prototype.trackIsVideoInput = function (track) {
        if (this.context.transceiverController.useTransceivers()) {
            this.logger.info("getting video track type (unified-plan)");
            return this.context.transceiverController.trackIsVideoInput(track);
        }
        this.logger.info("getting video track type (plan-b)");
        if (this.context.activeVideoInput) {
            var tracks = this.context.activeVideoInput.getVideoTracks();
            if (tracks && tracks.length > 0 && tracks[0].id === track.id) {
                return true;
            }
        }
        return false;
    };
    CreatePeerConnectionTask.prototype.addRemoteVideoTrack = function (track, stream) {
        var _this = this;
        var trackId = stream.id;
        if (!this.context.browserBehavior.requiresUnifiedPlan()) {
            this.logger.info('redefining MediaStream as track array (plan-b)');
            stream = new MediaStream([track]);
            trackId = track.id;
        }
        var attendeeId = this.context.videoStreamIndex.attendeeIdForTrack(trackId);
        // TODO: in case a previous tile with the same attendee id hasn't been cleaned up
        // we do it here to avoid showing a duplicate tile. We should try to understand
        // why this can happen, so adding a log statement to track this and learn more.
        var tilesRemoved = this.context.videoTileController.removeVideoTilesByAttendeeId(attendeeId);
        if (tilesRemoved.length > 0) {
            this.logger.warn("removing existing tiles " + tilesRemoved + " with same attendee id " + attendeeId);
        }
        var tile = this.context.videoTileController.addVideoTile();
        var streamId = this.context.videoStreamIndex.streamIdForTrack(trackId);
        if (typeof streamId === 'undefined') {
            this.logger.warn("stream not found for tile=" + tile.id() + " track=" + trackId);
            streamId = null;
        }
        var _loop_1 = function (i) {
            var trackEvent = this_1.trackEvents[i];
            var videoTracks = stream.getVideoTracks();
            if (videoTracks && videoTracks.length) {
                var videoTrack_1 = videoTracks[0];
                var callback_1 = function () {
                    _this.context.logger.info("received the " + trackEvent + " event for tile=" + tile.id() + " id=" + track.id + " streamId=" + streamId);
                };
                videoTrack_1.addEventListener(trackEvent, callback_1);
                if (!this_1.removeVideoTrackEventListeners[track.id]) {
                    this_1.removeVideoTrackEventListeners[track.id] = [];
                }
                this_1.removeVideoTrackEventListeners[track.id].push(function () {
                    videoTrack_1.removeEventListener(trackEvent, callback_1);
                });
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.trackEvents.length; i++) {
            _loop_1(i);
        }
        var width;
        var height;
        if (track.getCapabilities) {
            var cap = track.getCapabilities();
            width = cap.width;
            height = cap.height;
        }
        else {
            var cap = track.getSettings();
            width = cap.width;
            height = cap.height;
        }
        tile.bindVideoStream(attendeeId, false, stream, width, height, streamId);
        this.logger.info("video track added, created tile=" + tile.id() + " track=" + trackId + " streamId=" + streamId);
        var endEvent = 'removetrack';
        var target = stream;
        if (!this.context.browserBehavior.requiresUnifiedPlan()) {
            this.logger.info('updating end event and target track (plan-b)');
            endEvent = 'ended';
            // @ts-ignore
            target = track;
        }
        var trackRemovedHandler = function () { return _this.removeRemoteVideoTrack(track, tile.state()); };
        this.removeTrackRemovedEventListeners[track.id] = function () {
            target.removeEventListener(endEvent, trackRemovedHandler);
            delete _this.removeTrackRemovedEventListeners[track.id];
        };
        target.addEventListener(endEvent, trackRemovedHandler);
    };
    CreatePeerConnectionTask.prototype.removeRemoteVideoTrack = function (track, tileState) {
        var e_1, _a;
        this.removeTrackRemovedEventListeners[track.id]();
        try {
            for (var _b = __values(this.removeVideoTrackEventListeners[track.id]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var removeVideoTrackEventListener = _c.value;
                removeVideoTrackEventListener();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        delete this.removeVideoTrackEventListeners[track.id];
        this.logger.info("video track ended, removing tile=" + tileState.tileId + " id=" + track.id + " stream=" + tileState.streamId);
        if (tileState.streamId) {
            this.context.videosPaused.remove(tileState.streamId);
        }
        else {
            this.logger.warn("no stream found for tile=" + tileState.tileId);
        }
        this.context.videoTileController.removeVideoTile(tileState.tileId);
    };
    return CreatePeerConnectionTask;
}(BaseTask_1.default));
exports.default = CreatePeerConnectionTask;
//# sourceMappingURL=CreatePeerConnectionTask.js.map