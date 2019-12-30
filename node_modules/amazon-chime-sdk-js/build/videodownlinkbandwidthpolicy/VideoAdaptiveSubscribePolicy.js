"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultVideoStreamIdSet_1 = require("../videostreamidset/DefaultVideoStreamIdSet");
var VideoAdaptiveSubscribePolicy = /** @class */ (function () {
    function VideoAdaptiveSubscribePolicy(selfAttendeeId, tileController) {
        this.selfAttendeeId = selfAttendeeId;
        this.tileController = tileController;
        this.optimalReceiveSet = new DefaultVideoStreamIdSet_1.default();
        this.subscribedReceiveSet = new DefaultVideoStreamIdSet_1.default();
        this.bandwidthLimitationKbps = VideoAdaptiveSubscribePolicy.DEFAULT_BANDWIDTH_KBPS;
    }
    VideoAdaptiveSubscribePolicy.prototype.updateIndex = function (videoIndex) {
        this.videoIndex = videoIndex;
        this.optimalReceiveSet = this.calculateOptimalReceiveSet();
    };
    VideoAdaptiveSubscribePolicy.prototype.updateAvailableBandwidth = function (bandwidthKbps) {
        this.bandwidthLimitationKbps = bandwidthKbps;
        this.optimalReceiveSet = this.calculateOptimalReceiveSet();
    };
    VideoAdaptiveSubscribePolicy.prototype.updateCalculatedOptimalReceiveSet = function () {
        this.optimalReceiveSet = this.calculateOptimalReceiveSet();
    };
    VideoAdaptiveSubscribePolicy.prototype.wantsResubscribe = function () {
        return !this.subscribedReceiveSet.equal(this.optimalReceiveSet);
    };
    VideoAdaptiveSubscribePolicy.prototype.chooseSubscriptions = function () {
        this.subscribedReceiveSet = this.optimalReceiveSet.clone();
        return this.subscribedReceiveSet.clone();
    };
    VideoAdaptiveSubscribePolicy.prototype.calculateOptimalReceiveSet = function () {
        var remoteTiles = this.tileController.getAllRemoteVideoTiles();
        var videoSendingAttendees = this.videoIndex.allVideoSendingAttendeesExcludingSelf(this.selfAttendeeId);
        var lowResTiles = new Set();
        var highResTiles = new Set();
        for (var i = 0; i < remoteTiles.length; i++) {
            var tile = remoteTiles[i];
            var state = tile.state();
            if (state.active && videoSendingAttendees.has(state.boundAttendeeId)) {
                if (this.shouldBeLowResolution(tile)) {
                    lowResTiles.add(state.boundAttendeeId);
                }
                if (this.shouldBeHighResolution(tile)) {
                    highResTiles.add(state.boundAttendeeId);
                }
            }
        }
        return this.videoIndex.streamSelectionUnderBandwidthConstraint(this.selfAttendeeId, highResTiles, lowResTiles, this.bandwidthLimitationKbps);
    };
    VideoAdaptiveSubscribePolicy.prototype.shouldBeLowResolution = function (tile) {
        var tileArea = this.tileController.getVideoTileArea(tile);
        return tileArea < VideoAdaptiveSubscribePolicy.LOW_RESOLUTION_TILE_AREA_IN_PHYSICAL_PIXELS;
    };
    VideoAdaptiveSubscribePolicy.prototype.shouldBeHighResolution = function (tile) {
        var tileArea = this.tileController.getVideoTileArea(tile);
        return tileArea > VideoAdaptiveSubscribePolicy.HIGH_RESOLUTION_TILE_AREA_IN_PHYSICAL_PIXELS;
    };
    VideoAdaptiveSubscribePolicy.LOW_RESOLUTION_TILE_AREA_IN_PHYSICAL_PIXELS = 240 * 180;
    VideoAdaptiveSubscribePolicy.HIGH_RESOLUTION_TILE_AREA_IN_PHYSICAL_PIXELS = 512 * 384;
    VideoAdaptiveSubscribePolicy.DEFAULT_BANDWIDTH_KBPS = 2000;
    return VideoAdaptiveSubscribePolicy;
}());
exports.default = VideoAdaptiveSubscribePolicy;
//# sourceMappingURL=VideoAdaptiveSubscribePolicy.js.map