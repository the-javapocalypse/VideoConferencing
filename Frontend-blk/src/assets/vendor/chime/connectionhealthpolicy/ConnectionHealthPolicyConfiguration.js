"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectionHealthPolicyConfiguration = /** @class */ (function () {
    function ConnectionHealthPolicyConfiguration() {
        this.minHealth = 0;
        this.maxHealth = 1;
        this.initialHealth = 1;
        this.connectionUnhealthyThreshold = 10;
        this.noSignalThresholdTimeMs = 10000;
        this.connectionWaitTimeMs = 10000;
        this.zeroBarsNoSignalTimeMs = 5000;
        this.oneBarWeakSignalTimeMs = 5000;
        this.twoBarsTimeMs = 5000;
        this.threeBarsTimeMs = 10000;
        this.fourBarsTimeMs = 20000;
        this.fiveBarsTimeMs = 60000;
        this.cooldownTimeMs = 60000;
        this.pastSamplesToConsider = 15;
        this.goodSignalTimeMs = 15000;
        this.fractionalLoss = 0.5;
        this.packetsExpected = 50;
        this.maximumTimesToWarn = 2;
        this.missedPongsLowerThreshold = 1;
        this.missedPongsUpperThreshold = 2;
        this.maximumAudioDelayMs = 1000;
        this.maximumAudioDelayDataPoints = 10;
    }
    return ConnectionHealthPolicyConfiguration;
}());
exports.default = ConnectionHealthPolicyConfiguration;
//# sourceMappingURL=ConnectionHealthPolicyConfiguration.js.map