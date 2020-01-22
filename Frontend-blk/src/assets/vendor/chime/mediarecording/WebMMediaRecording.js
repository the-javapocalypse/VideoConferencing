"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var MediaRecordingEvent_1 = require("./MediaRecordingEvent");
var WebMMediaRecording = /** @class */ (function () {
    function WebMMediaRecording(mediaStream, options) {
        if (options === void 0) { options = {}; }
        var mediaRecorderOptions = __assign(__assign({}, options), WebMMediaRecording.options);
        this.delegate = new MediaRecorder(mediaStream, mediaRecorderOptions);
    }
    WebMMediaRecording.prototype.start = function (timeSliceMs) {
        var _this = this;
        /**
         * Chrome 'ended' callback:
         * This is a Chrome-specific callback that we receive when the user clicks the "Stop Sharing" button
         * in the Chrome screen sharing bar.
         */
        this.delegate.stream.getTracks().forEach(function (track) {
            track.addEventListener('ended', function () {
                var event = new CustomEvent(MediaRecordingEvent_1.default.EndedEvent, { detail: track });
                _this.dispatchEvent(event);
            });
        });
        this.delegate.start(timeSliceMs);
    };
    WebMMediaRecording.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve) {
            // this event should fire after any data is de-queued
            _this.delegate.addEventListener('stop', function () {
                resolve();
            });
            _this.delegate.stream.getTracks().forEach(function (track) {
                track.stop();
            });
            _this.delegate.stop();
        });
    };
    WebMMediaRecording.prototype.addEventListener = function (type, listener) {
        this.delegate.addEventListener(type, listener);
    };
    WebMMediaRecording.prototype.dispatchEvent = function (event) {
        return this.delegate.dispatchEvent(event);
    };
    WebMMediaRecording.prototype.removeEventListener = function (type, listener, options) {
        this.delegate.removeEventListener(type, listener, options);
    };
    WebMMediaRecording.options = {
        mimeType: 'video/webm; codecs=vp8',
    };
    return WebMMediaRecording;
}());
exports.default = WebMMediaRecording;
//# sourceMappingURL=WebMMediaRecording.js.map