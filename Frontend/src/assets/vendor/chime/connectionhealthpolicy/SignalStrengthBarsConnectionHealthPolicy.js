"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseConnectionHealthPolicy_1 = require("./BaseConnectionHealthPolicy");
var SignalStrengthBarsConnectionHealthPolicy = /** @class */ (function (_super) {
    __extends(SignalStrengthBarsConnectionHealthPolicy, _super);
    function SignalStrengthBarsConnectionHealthPolicy(configuration, data) {
        var _this = _super.call(this, configuration, data) || this;
        SignalStrengthBarsConnectionHealthPolicy.CONNECTION_UNHEALTHY_THRESHOLD =
            configuration.connectionUnhealthyThreshold;
        SignalStrengthBarsConnectionHealthPolicy.ZERO_BARS_NO_SIGNAL_TIME_MS =
            configuration.zeroBarsNoSignalTimeMs;
        SignalStrengthBarsConnectionHealthPolicy.ONE_BAR_WEAK_SIGNAL_TIME_MS =
            configuration.oneBarWeakSignalTimeMs;
        SignalStrengthBarsConnectionHealthPolicy.TWO_BARS_TIME_MS = configuration.twoBarsTimeMs;
        SignalStrengthBarsConnectionHealthPolicy.THREE_BARS_TIME_MS = configuration.threeBarsTimeMs;
        SignalStrengthBarsConnectionHealthPolicy.FOUR_BARS_TIME_MS = configuration.fourBarsTimeMs;
        SignalStrengthBarsConnectionHealthPolicy.FIVE_BARS_TIME_MS = configuration.fiveBarsTimeMs;
        SignalStrengthBarsConnectionHealthPolicy.MISSED_PONGS_LOWER_THRESHOLD =
            configuration.missedPongsLowerThreshold;
        SignalStrengthBarsConnectionHealthPolicy.MISSED_PONGS_UPPER_THRESHOLD =
            configuration.missedPongsUpperThreshold;
        return _this;
    }
    SignalStrengthBarsConnectionHealthPolicy.prototype.maximumHealth = function () {
        return 5;
    };
    SignalStrengthBarsConnectionHealthPolicy.prototype.health = function () {
        if (this.currentData.consecutiveStatsWithNoPackets >=
            SignalStrengthBarsConnectionHealthPolicy.CONNECTION_UNHEALTHY_THRESHOLD ||
            this.currentData.isNoSignalRecent(SignalStrengthBarsConnectionHealthPolicy.ZERO_BARS_NO_SIGNAL_TIME_MS) ||
            this.currentData.consecutiveMissedPongs >=
                SignalStrengthBarsConnectionHealthPolicy.MISSED_PONGS_UPPER_THRESHOLD) {
            return 0;
        }
        else if (this.currentData.isWeakSignalRecent(SignalStrengthBarsConnectionHealthPolicy.ONE_BAR_WEAK_SIGNAL_TIME_MS) ||
            this.currentData.isLastPacketLossRecent(SignalStrengthBarsConnectionHealthPolicy.TWO_BARS_TIME_MS) ||
            this.currentData.consecutiveMissedPongs >=
                SignalStrengthBarsConnectionHealthPolicy.MISSED_PONGS_LOWER_THRESHOLD) {
            return 1;
        }
        else if (this.currentData.isLastPacketLossRecent(SignalStrengthBarsConnectionHealthPolicy.THREE_BARS_TIME_MS)) {
            return 2;
        }
        else if (this.currentData.isLastPacketLossRecent(SignalStrengthBarsConnectionHealthPolicy.FOUR_BARS_TIME_MS)) {
            return 3;
        }
        else if (this.currentData.isLastPacketLossRecent(SignalStrengthBarsConnectionHealthPolicy.FIVE_BARS_TIME_MS)) {
            return 4;
        }
        return 5;
    };
    return SignalStrengthBarsConnectionHealthPolicy;
}(BaseConnectionHealthPolicy_1.default));
exports.default = SignalStrengthBarsConnectionHealthPolicy;
//# sourceMappingURL=SignalStrengthBarsConnectionHealthPolicy.js.map