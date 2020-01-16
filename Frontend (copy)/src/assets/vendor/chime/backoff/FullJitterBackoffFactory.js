"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var FullJitterBackoff_1 = require("./FullJitterBackoff");
var FullJitterBackoffFactory = /** @class */ (function () {
    function FullJitterBackoffFactory(fixedWaitMs, shortBackoffMs, longBackoffMs) {
        this.fixedWaitMs = fixedWaitMs;
        this.shortBackoffMs = shortBackoffMs;
        this.longBackoffMs = longBackoffMs;
    }
    FullJitterBackoffFactory.prototype.create = function () {
        return new FullJitterBackoff_1.default(this.fixedWaitMs, this.shortBackoffMs, this.longBackoffMs);
    };
    return FullJitterBackoffFactory;
}());
exports.default = FullJitterBackoffFactory;
//# sourceMappingURL=FullJitterBackoffFactory.js.map