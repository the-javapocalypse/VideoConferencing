"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
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
var DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
var DefaultTransceiverController = /** @class */ (function () {
    function DefaultTransceiverController(logger) {
        this.logger = logger;
        this.localCameraTransceiver = null;
        this.localAudioTransceiver = null;
        this.videoSubscriptions = [];
        this.defaultMediaStream = null;
        this.peer = null;
        this.browserBehavior = new DefaultBrowserBehavior_1.default();
    }
    DefaultTransceiverController.setVideoSendingBitrateKbpsForSender = function (sender, bitrateKbps, logger) {
        var e_1, _a;
        if (!sender || bitrateKbps <= 0) {
            return;
        }
        var param = sender.getParameters();
        if (!param.encodings) {
            param.encodings = [{}];
        }
        try {
            for (var _b = __values(param.encodings), _c = _b.next(); !_c.done; _c = _b.next()) {
                var encodeParam = _c.value;
                encodeParam.maxBitrate = bitrateKbps * 1000;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        sender.setParameters(param);
        logger.info("set video send bandwidth to " + bitrateKbps + "kbps");
    };
    DefaultTransceiverController.prototype.setVideoSendingBitrateKbps = function (bitrateKbps) {
        // this won't set bandwidth limitation for video in Chrome
        if (!this.localCameraTransceiver || this.localCameraTransceiver.direction !== 'sendrecv') {
            return;
        }
        var sender = this.localCameraTransceiver.sender;
        DefaultTransceiverController.setVideoSendingBitrateKbpsForSender(sender, bitrateKbps, this.logger);
    };
    DefaultTransceiverController.prototype.setPeer = function (peer) {
        this.peer = peer;
    };
    DefaultTransceiverController.prototype.reset = function () {
        this.localCameraTransceiver = null;
        this.localAudioTransceiver = null;
        this.videoSubscriptions = [];
        this.defaultMediaStream = null;
        this.peer = null;
    };
    DefaultTransceiverController.prototype.useTransceivers = function () {
        if (!this.peer || !this.browserBehavior.requiresUnifiedPlan()) {
            return false;
        }
        return typeof this.peer.getTransceivers !== 'undefined';
    };
    DefaultTransceiverController.prototype.trackIsVideoInput = function (track) {
        if (!this.localCameraTransceiver) {
            return false;
        }
        return (track === this.localCameraTransceiver.sender.track ||
            track === this.localCameraTransceiver.receiver.track);
    };
    DefaultTransceiverController.prototype.setupLocalTransceivers = function () {
        if (!this.useTransceivers()) {
            return;
        }
        if (!this.defaultMediaStream && typeof MediaStream !== 'undefined') {
            this.defaultMediaStream = new MediaStream();
        }
        if (!this.localAudioTransceiver) {
            this.localAudioTransceiver = this.peer.addTransceiver('audio', {
                direction: 'inactive',
                streams: [this.defaultMediaStream],
            });
        }
        if (!this.localCameraTransceiver) {
            this.localCameraTransceiver = this.peer.addTransceiver('video', {
                direction: 'inactive',
                streams: [this.defaultMediaStream],
            });
        }
    };
    DefaultTransceiverController.prototype.setAudioInput = function (track) {
        this.setTransceiverInput(this.localAudioTransceiver, track);
    };
    DefaultTransceiverController.prototype.setVideoInput = function (track) {
        this.setTransceiverInput(this.localCameraTransceiver, track);
    };
    DefaultTransceiverController.prototype.updateVideoTransceivers = function (videoStreamIndex, videosToReceive) {
        var _this = this;
        if (!this.useTransceivers()) {
            return videosToReceive.array();
        }
        // See https://blog.mozilla.org/webrtc/rtcrtptransceiver-explored/ for details on transceivers
        var transceivers = this.peer.getTransceivers();
        // Subscription index 0 is reserved for transmitting camera.
        // We mark inactive slots with 0 in the subscription array.
        this.videoSubscriptions = [0];
        videosToReceive = videosToReceive.clone();
        this.unsubscribeTransceivers(transceivers, videoStreamIndex, videosToReceive);
        this.subscribeTransceivers(transceivers, videosToReceive);
        this.logger.debug(function () {
            return _this.debugDumpTransceivers();
        });
        return this.videoSubscriptions;
    };
    DefaultTransceiverController.prototype.unsubscribeTransceivers = function (transceivers, videoStreamIndex, videosToReceive) {
        var e_2, _a;
        try {
            // disable transceivers which are no longer going to subscribe
            for (var transceivers_1 = __values(transceivers), transceivers_1_1 = transceivers_1.next(); !transceivers_1_1.done; transceivers_1_1 = transceivers_1.next()) {
                var transceiver = transceivers_1_1.value;
                if (transceiver === this.localCameraTransceiver || !this.transceiverIsVideo(transceiver)) {
                    continue;
                }
                // by convention with the video host, msid is equal to the media section mid, prefixed with the string "v_"
                // we use this to get the streamId for the track
                var streamId = videoStreamIndex.streamIdForTrack('v_' + transceiver.mid);
                if (streamId !== undefined && videosToReceive.contain(streamId)) {
                    transceiver.direction = 'recvonly';
                    this.videoSubscriptions.push(streamId);
                    videosToReceive.remove(streamId);
                }
                else {
                    transceiver.direction = 'inactive';
                    // mark this slot inactive with a 0 in the subscription array
                    this.videoSubscriptions.push(0);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (transceivers_1_1 && !transceivers_1_1.done && (_a = transceivers_1.return)) _a.call(transceivers_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    DefaultTransceiverController.prototype.subscribeTransceivers = function (transceivers, videosToReceive) {
        var e_3, _a, e_4, _b;
        if (videosToReceive.size() === 0) {
            return;
        }
        // Handle remaining subscriptions using existing inactive transceivers.
        var videosRemaining = videosToReceive.array();
        // Begin counting out index in the the subscription array at 1 since the camera.
        // Always occupies position 0 (whether active or not).
        var n = 1;
        try {
            for (var transceivers_2 = __values(transceivers), transceivers_2_1 = transceivers_2.next(); !transceivers_2_1.done; transceivers_2_1 = transceivers_2.next()) {
                var transceiver = transceivers_2_1.value;
                if (transceiver === this.localCameraTransceiver || !this.transceiverIsVideo(transceiver)) {
                    continue;
                }
                if (transceiver.direction === 'inactive') {
                    transceiver.direction = 'recvonly';
                    var streamId = videosRemaining.shift();
                    this.videoSubscriptions[n] = streamId;
                    if (videosRemaining.length === 0) {
                        break;
                    }
                }
                n += 1;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (transceivers_2_1 && !transceivers_2_1.done && (_a = transceivers_2.return)) _a.call(transceivers_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            // add transceivers for the remaining subscriptions
            for (var videosRemaining_1 = __values(videosRemaining), videosRemaining_1_1 = videosRemaining_1.next(); !videosRemaining_1_1.done; videosRemaining_1_1 = videosRemaining_1.next()) {
                var index = videosRemaining_1_1.value;
                // @ts-ignore
                var transceiver = this.peer.addTransceiver('video', {
                    direction: 'recvonly',
                    streams: [this.defaultMediaStream],
                });
                this.videoSubscriptions.push(index);
                this.logger.info("adding transceiver mid: " + transceiver.mid + " subscription: " + index + " direction: recvonly");
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (videosRemaining_1_1 && !videosRemaining_1_1.done && (_b = videosRemaining_1.return)) _b.call(videosRemaining_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    DefaultTransceiverController.prototype.transceiverIsVideo = function (transceiver) {
        return ((transceiver.receiver &&
            transceiver.receiver.track &&
            transceiver.receiver.track.kind === 'video') ||
            (transceiver.sender && transceiver.sender.track && transceiver.sender.track.kind === 'video'));
    };
    DefaultTransceiverController.prototype.debugDumpTransceivers = function () {
        var e_5, _a;
        var msg = '';
        var n = 0;
        try {
            for (var _b = __values(this.peer.getTransceivers()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var transceiver = _c.value;
                if (!this.transceiverIsVideo(transceiver)) {
                    continue;
                }
                msg += "transceiver index=" + n + " mid=" + transceiver.mid + " subscription=" + this.videoSubscriptions[n] + " direction=" + transceiver.direction + "\n";
                n += 1;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return msg;
    };
    DefaultTransceiverController.prototype.setTransceiverInput = function (transceiver, track) {
        if (!transceiver) {
            return;
        }
        if (track) {
            transceiver.direction = 'sendrecv';
        }
        else {
            transceiver.direction = 'inactive';
        }
        transceiver.sender.replaceTrack(track);
    };
    return DefaultTransceiverController;
}());
exports.default = DefaultTransceiverController;
//# sourceMappingURL=DefaultTransceiverController.js.map