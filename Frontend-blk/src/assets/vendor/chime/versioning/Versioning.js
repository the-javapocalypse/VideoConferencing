"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultBrowserBehavior_1 = require("../browserbehavior/DefaultBrowserBehavior");
var Versioning = /** @class */ (function () {
    function Versioning() {
    }
    Object.defineProperty(Versioning, "sdkVersion", {
        /**
         * Return string representation of SDK version
         */
        get: function () {
            return '1.0.0';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Versioning, "sdkUserAgentLowResolution", {
        /**
         * Return low-resolution string representation of SDK user agent (e.g. `chrome-78`)
         */
        get: function () {
            var browserBehavior = new DefaultBrowserBehavior_1.default();
            return browserBehavior.name() + "-" + browserBehavior.majorVersion();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return URL with versioning information appended
     */
    Versioning.urlWithVersion = function (url) {
        var urlWithVersion = new URL(url);
        urlWithVersion.searchParams.append(Versioning.X_AMZN_VERSION, Versioning.sdkVersion);
        urlWithVersion.searchParams.append(Versioning.X_AMZN_USER_AGENT, Versioning.sdkUserAgentLowResolution);
        return urlWithVersion.toString();
    };
    Versioning.X_AMZN_VERSION = 'X-Amzn-Version';
    Versioning.X_AMZN_USER_AGENT = 'X-Amzn-User-Agent';
    return Versioning;
}());
exports.default = Versioning;
//# sourceMappingURL=Versioning.js.map