"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("../maybe/Maybe");
var TimeoutScheduler_1 = require("../scheduler/TimeoutScheduler");
var PromisedWebSocketClosureCode_1 = require("./PromisedWebSocketClosureCode");
var ReconnectingPromisedWebSocket = /** @class */ (function () {
    function ReconnectingPromisedWebSocket(url, protocols, binaryType, webSocketFactory, backoff) {
        this.url = url;
        this.protocols = protocols;
        this.binaryType = binaryType;
        this.webSocketFactory = webSocketFactory;
        this.backoff = backoff;
        this.callbacks = new Map();
        this.timeoutScheduler = null;
        this.webSocket = null;
    }
    ReconnectingPromisedWebSocket.prototype.close = function (timeoutMs, code, reason) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.webSocket === null) {
                reject(new Error('closed'));
            }
            _this.willCloseWebSocket();
            _this.webSocket.close(timeoutMs, code, reason).then(resolve);
        });
    };
    ReconnectingPromisedWebSocket.prototype.open = function (timeoutMs) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.webSocket !== null) {
                reject(new Error('opened'));
            }
            _this.webSocket = _this.webSocketFactory.create(_this.url, _this.protocols, _this.binaryType);
            _this.webSocket.addEventListener('close', function (event) {
                if (ReconnectingPromisedWebSocket.normalClosureCodes.indexOf(event.code) <= -1) {
                    var timeout = _this.backoff.nextBackoffAmountMs();
                    _this.timeoutScheduler = new TimeoutScheduler_1.default(timeout);
                    _this.timeoutScheduler.start(function () {
                        _this.timeoutScheduler.stop();
                        _this.open(timeoutMs).then(function () { });
                    });
                    _this.dispatchEvent(new CustomEvent('reconnect'));
                }
                else {
                    _this.dispatchEvent(event);
                }
                _this.webSocket = null;
            });
            _this.webSocket.addEventListener('message', function (event) {
                _this.dispatchEvent(event);
            });
            _this.webSocket.open(timeoutMs).then(function (event) {
                _this.didOpenWebSocket();
                resolve(event);
            });
        });
    };
    ReconnectingPromisedWebSocket.prototype.send = function (data) {
        if (this.webSocket === null) {
            throw new Error('closed');
        }
        this.webSocket.send(data);
    };
    ReconnectingPromisedWebSocket.prototype.dispatchEvent = function (event) {
        Maybe_1.default.of(this.callbacks.get(event.type)).map(function (listeners) {
            return listeners.forEach(function (listener) { return listener(event); });
        });
        return event.defaultPrevented;
    };
    ReconnectingPromisedWebSocket.prototype.addEventListener = function (type, listener) {
        var _this = this;
        Maybe_1.default.of(this.callbacks.get(type))
            .defaulting(new Set())
            .map(function (listeners) { return listeners.add(listener); })
            .map(function (listeners) { return _this.callbacks.set(type, listeners); });
    };
    ReconnectingPromisedWebSocket.prototype.removeEventListener = function (type, listener) {
        Maybe_1.default.of(this.callbacks.get(type)).map(function (f) { return f.delete(listener); });
    };
    ReconnectingPromisedWebSocket.prototype.didOpenWebSocket = function () {
        Maybe_1.default.of(this.timeoutScheduler).map(function (scheduler) { return scheduler.stop(); });
        this.backoff.reset();
        this.timeoutScheduler = null;
    };
    ReconnectingPromisedWebSocket.prototype.willCloseWebSocket = function () {
        this.didOpenWebSocket();
    };
    ReconnectingPromisedWebSocket.normalClosureCodes = Array.of(PromisedWebSocketClosureCode_1.default.Normal, PromisedWebSocketClosureCode_1.default.EmptyCloseFrame);
    return ReconnectingPromisedWebSocket;
}());
exports.default = ReconnectingPromisedWebSocket;
//# sourceMappingURL=ReconnectingPromisedWebSocket.js.map