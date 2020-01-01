"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var ReconnectingPromisedWebSocket_1 = require("./ReconnectingPromisedWebSocket");
var ReconnectingPromisedWebSocketFactory = /** @class */ (function () {
    function ReconnectingPromisedWebSocketFactory(promisedWebSocketFactory, backoffFactory) {
        this.promisedWebSocketFactory = promisedWebSocketFactory;
        this.backoffFactory = backoffFactory;
    }
    ReconnectingPromisedWebSocketFactory.prototype.create = function (url, protocols, binaryType) {
        return new ReconnectingPromisedWebSocket_1.default(url, protocols, binaryType, this.promisedWebSocketFactory, this.backoffFactory.create());
    };
    return ReconnectingPromisedWebSocketFactory;
}());
exports.default = ReconnectingPromisedWebSocketFactory;
//# sourceMappingURL=ReconnectingPromisedWebSocketFactory.js.map