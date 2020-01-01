"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var detect_browser_1 = require("detect-browser");
var DefaultBrowserBehavior = /** @class */ (function () {
    function DefaultBrowserBehavior() {
        this.browser = detect_browser_1.detect();
    }
    DefaultBrowserBehavior.prototype.version = function () {
        return this.browser.version;
    };
    DefaultBrowserBehavior.prototype.majorVersion = function () {
        return parseInt(this.version().split('.')[0]);
    };
    DefaultBrowserBehavior.prototype.isEdgeChromium = function () {
        return this.browser.name === 'edge-chromium';
    };
    DefaultBrowserBehavior.prototype.isSafari = function () {
        return this.browser.name === 'safari';
    };
    DefaultBrowserBehavior.prototype.isChrome = function () {
        return this.browser.name === 'chrome';
    };
    DefaultBrowserBehavior.prototype.isFirefox = function () {
        return this.browser.name === 'firefox';
    };
    DefaultBrowserBehavior.prototype.name = function () {
        return this.browser.name;
    };
    DefaultBrowserBehavior.prototype.requiresUnifiedPlan = function () {
        return this.isSafari() || this.isFirefox();
    };
    DefaultBrowserBehavior.prototype.requiresIceCandidateCompletionBypass = function () {
        return true;
    };
    DefaultBrowserBehavior.prototype.requiresIceCandidateGatheringTimeoutWorkaround = function () {
        return this.isChrome();
    };
    DefaultBrowserBehavior.prototype.requiresUnifiedPlanMunging = function () {
        return this.isSafari();
    };
    DefaultBrowserBehavior.prototype.requiresPromiseBasedWebRTCGetStats = function () {
        return this.isSafari() || this.isFirefox();
    };
    DefaultBrowserBehavior.prototype.isSupported = function () {
        if (this.isSafari()) {
            return false;
        }
        else if (this.isChrome()) {
            return this.majorVersion() >= 78;
        }
        else if (this.isFirefox()) {
            return this.majorVersion() >= 60;
        }
        else if (this.isEdgeChromium()) {
            return this.majorVersion() >= 79;
        }
        return false;
    };
    DefaultBrowserBehavior.prototype.supportString = function () {
        return 'Chromium 78+, Electron 7+, Microsoft Edge 79+, Google Chrome 78+, Mozilla Firefox 60+';
    };
    return DefaultBrowserBehavior;
}());
exports.default = DefaultBrowserBehavior;
//# sourceMappingURL=DefaultBrowserBehavior.js.map