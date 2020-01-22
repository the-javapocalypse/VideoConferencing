"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("../maybe/Maybe");
var ScreenShareStreamingEvent_1 = require("../screensharestreaming/ScreenShareStreamingEvent");
var ScreenSharingMessageFlag_1 = require("../screensharingmessage/ScreenSharingMessageFlag");
var ScreenSharingMessageType_1 = require("../screensharingmessage/ScreenSharingMessageType");
var DefaultScreenSharingSession = /** @class */ (function () {
    function DefaultScreenSharingSession(webSocket, constraintsProvider, timeSliceMs, messageSerialization, mediaStreamBroker, screenShareStreamFactory, mediaRecordingFactory, logger) {
        this.webSocket = webSocket;
        this.constraintsProvider = constraintsProvider;
        this.timeSliceMs = timeSliceMs;
        this.messageSerialization = messageSerialization;
        this.mediaStreamBroker = mediaStreamBroker;
        this.screenShareStreamFactory = screenShareStreamFactory;
        this.mediaRecordingFactory = mediaRecordingFactory;
        this.logger = logger;
        this.observerQueue = new Set();
        this.stream = null;
    }
    DefaultScreenSharingSession.prototype.open = function (timeoutMs) {
        var _this = this;
        this.webSocket.addEventListener('message', function (event) {
            _this.didReceiveMessageEvent(event);
            _this.logger.debug(function () { return 'dispatched message event'; });
        });
        this.webSocket.addEventListener('close', function (event) {
            _this.stop().catch(function () { });
            _this.observerQueue.forEach(function (observer) {
                Maybe_1.default.of(observer.didClose).map(function (f) { return f.bind(observer)(event); });
            });
        });
        this.webSocket.addEventListener('reconnect', function (event) {
            _this.logger.warn('WebSocket reconnecting');
            _this.stop().catch(function () { });
            _this.observerQueue.forEach(function (observer) {
                Maybe_1.default.of(observer.willReconnect).map(function (f) { return f.bind(observer)(event); });
            });
        });
        return this.webSocket.open(timeoutMs).then(function (event) {
            _this.observerQueue.forEach(function (observer) {
                Maybe_1.default.of(observer.didOpen).map(function (f) { return f.bind(observer)(event); });
            });
            return event;
        });
    };
    DefaultScreenSharingSession.prototype.close = function (timeoutMs) {
        var _this = this;
        return this.webSocket.close(timeoutMs).then(function (event) {
            _this.observerQueue.forEach(function (observer) {
                Maybe_1.default.of(observer.didClose).map(function (f) { return f.bind(observer)(event); });
            });
            return event;
        });
    };
    DefaultScreenSharingSession.prototype.start = function (sourceId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.stream !== null) {
                reject(new Error('started'));
            }
            return _this.mediaStreamBroker
                .acquireDisplayInputStream(_this.constraintsProvider(sourceId))
                .then(function (mediaStream) {
                return _this.mediaRecordingFactory.create(mediaStream);
            })
                .then(function (mediaRecording) {
                return _this.screenShareStreamFactory.create(mediaRecording);
            })
                .then(function (stream) {
                stream.addEventListener(ScreenShareStreamingEvent_1.default.MessageEvent, function (event) {
                    _this.send(event.detail);
                    _this.logger.debug(function () { return 'dispatched screen sharing stream message event'; });
                });
                stream.addEventListener(ScreenShareStreamingEvent_1.default.EndedEvent, function () {
                    _this.logger.info('stream ended');
                    _this.stop().then(function () { });
                });
                (_this.stream = stream).start(_this.timeSliceMs);
            })
                .then(function () {
                _this.observerQueue.forEach(function (observer) {
                    Maybe_1.default.of(observer.didStartScreenSharing).map(function (f) { return f.bind(observer)(); });
                });
            })
                .then(function () {
                _this.logger.info('screen sharing stream started');
            })
                .then(resolve);
        });
    };
    DefaultScreenSharingSession.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.stream === null) {
                reject(new Error('not started'));
            }
            _this.stream
                .stop()
                .then(function () {
                _this.stream = null;
            })
                .then(function () {
                _this.observerQueue.forEach(function (observer) {
                    Maybe_1.default.of(observer.didStopScreenSharing).map(function (f) { return f.bind(observer)(); });
                });
            })
                .then(function () {
                _this.logger.info('screen sharing stream stopped');
            })
                .then(resolve);
        });
    };
    DefaultScreenSharingSession.prototype.registerObserver = function (observer) {
        this.observerQueue.add(observer);
        return this;
    };
    DefaultScreenSharingSession.prototype.deregisterObserver = function (observer) {
        this.observerQueue.delete(observer);
        return this;
    };
    DefaultScreenSharingSession.prototype.didReceiveMessageEvent = function (event) {
        this.logger.debug(function () { return "didReceiveMessageEvent: " + new Uint8Array(event.data); });
        var message = this.messageSerialization.deserialize(new Uint8Array(event.data));
        switch (message.type) {
            case ScreenSharingMessageType_1.default.HeartbeatRequestType:
                return this.didReceiveHeartbeatRequestMessage();
            case ScreenSharingMessageType_1.default.StreamStop:
                return this.didReceiveStreamStopMessage();
            default:
                return this.didReceiveUnknownMessage();
        }
    };
    DefaultScreenSharingSession.prototype.didReceiveStreamStopMessage = function () {
        this.logger.debug(function () { return 'received stream stop message'; });
        this.observerQueue.forEach(function (observer) {
            Maybe_1.default.of(observer.didReceiveStreamStopMessage).map(function (f) { return f.bind(observer)(); });
        });
        this.stop().then(function () { });
    };
    DefaultScreenSharingSession.prototype.didReceiveUnknownMessage = function () {
        this.logger.debug(function () { return 'received unknown message'; });
        this.observerQueue.forEach(function (observer) {
            Maybe_1.default.of(observer.didReceiveUnknownMessage).map(function (f) { return f.bind(observer)(); });
        });
    };
    DefaultScreenSharingSession.prototype.didReceiveHeartbeatRequestMessage = function () {
        this.logger.debug(function () { return 'received heartbeat request'; });
        this.observerQueue.forEach(function (observer) {
            Maybe_1.default.of(observer.didReceiveHeartbeatRequest).map(function (f) { return f.bind(observer)(); });
        });
        var response = {
            type: ScreenSharingMessageType_1.default.HeartbeatResponseType,
            flags: [ScreenSharingMessageFlag_1.default.Local],
            data: new Uint8Array([]),
        };
        this.send(response);
        this.observerQueue.forEach(function (observer) {
            Maybe_1.default.of(observer.didSendHeartbeatResponse).map(function (f) { return f.bind(observer)(); });
        });
    };
    DefaultScreenSharingSession.prototype.send = function (message) {
        this.webSocket.send(this.messageSerialization.serialize(message));
        this.logger.debug(function () { return 'sent screen sharing message'; });
        this.observerQueue.forEach(function (observer) {
            Maybe_1.default.of(observer.didSendScreenSharingMessage).map(function (f) { return f.bind(observer)(message.type); });
        });
        return message;
    };
    return DefaultScreenSharingSession;
}());
exports.default = DefaultScreenSharingSession;
//# sourceMappingURL=DefaultScreenSharingSession.js.map