"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("../maybe/Maybe");
var TimeoutScheduler_1 = require("../scheduler/TimeoutScheduler");
var DefaultPromisedWebSocket = /** @class */ (function () {
    function DefaultPromisedWebSocket(webSocket) {
        this.webSocket = webSocket;
        this.callbacks = new Map();
    }
    DefaultPromisedWebSocket.prototype.open = function (timeoutMs) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.webSocket.onclose = function (event) {
                _this.dispatchEvent(event);
            };
            _this.webSocket.onmessage = function (event) {
                _this.dispatchEvent(event);
            };
            _this.webSocket.onopen = function (event) {
                _this.dispatchEvent(event);
                resolve(event);
            };
            _this.webSocket.onerror = function (event) {
                _this.dispatchEvent(event);
                reject(event);
            };
        });
        return this.withTimeout(promise, timeoutMs);
    };
    DefaultPromisedWebSocket.prototype.close = function (timeoutMs, code, reason) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this.webSocket.onclose = function (event) {
                _this.dispatchEvent(event);
                resolve(event);
            };
            _this.webSocket.onerror = function (event) {
                _this.dispatchEvent(event);
                reject(event);
            };
            _this.webSocket.close(code, reason);
        });
        return this.withTimeout(promise, timeoutMs);
    };
    DefaultPromisedWebSocket.prototype.send = function (data) {
        this.webSocket.send(data);
    };
    DefaultPromisedWebSocket.prototype.onMessage = function (fn) {
        this.addEventListener('message', fn);
        return this;
    };
    DefaultPromisedWebSocket.prototype.onClose = function (fn) {
        this.addEventListener('close', fn);
        return this;
    };
    DefaultPromisedWebSocket.prototype.dispatchEvent = function (event) {
        Maybe_1.default.of(this.callbacks.get(event.type)).map(function (listeners) {
            return listeners.forEach(function (listener) { return listener(event); });
        });
        return event.defaultPrevented;
    };
    DefaultPromisedWebSocket.prototype.addEventListener = function (type, listener) {
        var _this = this;
        Maybe_1.default.of(this.callbacks.get(type))
            .defaulting(new Set())
            .map(function (listeners) { return listeners.add(listener); })
            .map(function (listeners) { return _this.callbacks.set(type, listeners); });
    };
    DefaultPromisedWebSocket.prototype.removeEventListener = function (type, listener) {
        Maybe_1.default.of(this.callbacks.get(type)).map(function (f) { return f.delete(listener); });
    };
    DefaultPromisedWebSocket.prototype.withTimeout = function (promise, timeoutMs) {
        var timeout = new Promise(function (resolve, reject) {
            new TimeoutScheduler_1.default(timeoutMs).start(function () {
                reject(new Error('Promise timed out after ' + timeoutMs + 'ms'));
            });
        });
        return Promise.race([promise, timeout]);
    };
    return DefaultPromisedWebSocket;
}());
exports.default = DefaultPromisedWebSocket;
//# sourceMappingURL=DefaultPromisedWebSocket.js.map