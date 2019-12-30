"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var VideoCaptureAndEncodeParameters_1 = require("../videouplinkbandwidthpolicy/VideoCaptureAndEncodeParameters");
var NoVideoUplinkBandwidthPolicy = /** @class */ (function () {
    function NoVideoUplinkBandwidthPolicy() {
    }
    NoVideoUplinkBandwidthPolicy.prototype.updateIndex = function (_videoIndex) { };
    NoVideoUplinkBandwidthPolicy.prototype.wantsResubscribe = function () {
        return false;
    };
    NoVideoUplinkBandwidthPolicy.prototype.chooseCaptureAndEncodeParameters = function () {
        return new VideoCaptureAndEncodeParameters_1.default();
    };
    NoVideoUplinkBandwidthPolicy.prototype.maxBandwidthKbps = function () {
        return 0;
    };
    NoVideoUplinkBandwidthPolicy.prototype.setIdealMaxBandwidthKbps = function (_idealMaxBandwidthKbps) { };
    NoVideoUplinkBandwidthPolicy.prototype.setHasBandwidthPriority = function (_hasBandwidthPriority) { };
    return NoVideoUplinkBandwidthPolicy;
}());
exports.default = NoVideoUplinkBandwidthPolicy;
//# sourceMappingURL=NoVideoUplinkBandwidthPolicy.js.map