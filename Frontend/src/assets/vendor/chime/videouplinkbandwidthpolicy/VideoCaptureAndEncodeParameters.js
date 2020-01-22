"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var VideoCaptureAndEncodeParameters = /** @class */ (function () {
    function VideoCaptureAndEncodeParameters(captureWidth, captureHeight, captureFrameRate, maxEncodeBitrateKbps) {
        if (captureWidth === void 0) { captureWidth = 0; }
        if (captureHeight === void 0) { captureHeight = 0; }
        if (captureFrameRate === void 0) { captureFrameRate = 0; }
        if (maxEncodeBitrateKbps === void 0) { maxEncodeBitrateKbps = 0; }
        this.captureWidth = captureWidth;
        this.captureHeight = captureHeight;
        this.captureFrameRate = captureFrameRate;
        this.maxEncodeBitrateKbps = maxEncodeBitrateKbps;
    }
    VideoCaptureAndEncodeParameters.prototype.equal = function (other) {
        return (other.captureWidth === this.captureWidth &&
            other.captureHeight === this.captureHeight &&
            other.captureFrameRate === this.captureFrameRate &&
            other.maxEncodeBitrateKbps === this.maxEncodeBitrateKbps);
    };
    VideoCaptureAndEncodeParameters.prototype.clone = function () {
        return new VideoCaptureAndEncodeParameters(this.captureWidth, this.captureHeight, this.captureFrameRate, this.maxEncodeBitrateKbps);
    };
    return VideoCaptureAndEncodeParameters;
}());
exports.default = VideoCaptureAndEncodeParameters;
//# sourceMappingURL=VideoCaptureAndEncodeParameters.js.map