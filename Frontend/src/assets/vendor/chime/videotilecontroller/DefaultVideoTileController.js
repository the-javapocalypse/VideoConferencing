"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultDevicePixelRatioMonitor_1 = require("../devicepixelratiomonitor/DefaultDevicePixelRatioMonitor");
var DevicePixelRatioWindowSource_1 = require("../devicepixelratiosource/DevicePixelRatioWindowSource");
var Maybe_1 = require("../maybe/Maybe");
var DefaultVideoTileController = /** @class */ (function () {
    function DefaultVideoTileController(tileFactory, audioVideoController, logger) {
        this.tileFactory = tileFactory;
        this.audioVideoController = audioVideoController;
        this.logger = logger;
        this.tileMap = new Map();
        this.nextTileId = 1;
        this.currentLocalTile = null;
        this.devicePixelRatioMonitor = new DefaultDevicePixelRatioMonitor_1.default(new DevicePixelRatioWindowSource_1.default(), logger);
    }
    DefaultVideoTileController.prototype.bindVideoElement = function (tileId, videoElement) {
        var tile = this.getVideoTile(tileId);
        if (tile === null) {
            this.logger.warn("Ignoring video element binding for unknown tile id " + tileId);
            return;
        }
        tile.bindVideoElement(videoElement);
    };
    DefaultVideoTileController.prototype.unbindVideoElement = function (tileId) {
        this.bindVideoElement(tileId, null);
    };
    DefaultVideoTileController.prototype.startLocalVideoTile = function () {
        var tile = this.findOrCreateLocalVideoTile();
        this.currentLocalTile.stateRef().localTileStarted = true;
        this.audioVideoController.update();
        return tile.id();
    };
    DefaultVideoTileController.prototype.stopLocalVideoTile = function () {
        if (!this.currentLocalTile) {
            return;
        }
        this.currentLocalTile.stateRef().localTileStarted = false;
        this.currentLocalTile.bindVideoStream(this.audioVideoController.configuration.credentials.attendeeId, true, null, null, null, null);
        this.audioVideoController.update();
    };
    DefaultVideoTileController.prototype.hasStartedLocalVideoTile = function () {
        return !!(this.currentLocalTile && this.currentLocalTile.stateRef().localTileStarted);
    };
    DefaultVideoTileController.prototype.removeLocalVideoTile = function () {
        if (this.currentLocalTile) {
            this.removeVideoTile(this.currentLocalTile.id());
        }
    };
    DefaultVideoTileController.prototype.getLocalVideoTile = function () {
        return this.currentLocalTile;
    };
    DefaultVideoTileController.prototype.pauseVideoTile = function (tileId) {
        var tile = this.getVideoTile(tileId);
        if (tile) {
            tile.pause();
        }
    };
    DefaultVideoTileController.prototype.unpauseVideoTile = function (tileId) {
        var tile = this.getVideoTile(tileId);
        if (tile) {
            tile.unpause();
        }
    };
    DefaultVideoTileController.prototype.getVideoTile = function (tileId) {
        return this.tileMap.has(tileId) ? this.tileMap.get(tileId) : null;
    };
    DefaultVideoTileController.prototype.getVideoTileArea = function (tile) {
        var state = tile.state();
        var tileHeight = 0;
        var tileWidth = 0;
        if (state.boundVideoElement) {
            tileHeight = state.boundVideoElement.clientHeight * state.devicePixelRatio;
            tileWidth = state.boundVideoElement.clientWidth * state.devicePixelRatio;
        }
        return tileHeight * tileWidth;
    };
    DefaultVideoTileController.prototype.getAllRemoteVideoTiles = function () {
        var _this = this;
        var result = new Array();
        this.tileMap.forEach(function (tile, tileId) {
            if (!_this.currentLocalTile || tileId !== _this.currentLocalTile.id()) {
                result.push(tile);
            }
        });
        return result;
    };
    DefaultVideoTileController.prototype.getAllVideoTiles = function () {
        return Array.from(this.tileMap.values());
    };
    DefaultVideoTileController.prototype.addVideoTile = function (localTile) {
        if (localTile === void 0) { localTile = false; }
        var tileId = this.nextTileId;
        this.nextTileId += 1;
        var tile = this.tileFactory.makeTile(tileId, localTile, this, this.devicePixelRatioMonitor);
        this.tileMap.set(tileId, tile);
        return tile;
    };
    DefaultVideoTileController.prototype.removeVideoTile = function (tileId) {
        if (!this.tileMap.has(tileId)) {
            return;
        }
        var tile = this.tileMap.get(tileId);
        if (this.currentLocalTile === tile) {
            this.currentLocalTile = null;
        }
        tile.destroy();
        this.tileMap.delete(tileId);
        this.audioVideoController.forEachObserver(function (observer) {
            Maybe_1.default.of(observer.videoTileWasRemoved).map(function (f) { return f.bind(observer)(tileId); });
        });
    };
    DefaultVideoTileController.prototype.removeVideoTilesByAttendeeId = function (attendeeId) {
        var e_1, _a;
        var tilesRemoved = [];
        try {
            for (var _b = __values(this.getAllVideoTiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tile = _c.value;
                var state = tile.state();
                if (state.boundAttendeeId === attendeeId) {
                    this.removeVideoTile(state.tileId);
                    tilesRemoved.push(state.tileId);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return tilesRemoved;
    };
    DefaultVideoTileController.prototype.removeAllVideoTiles = function () {
        var e_2, _a;
        var tileIds = Array.from(this.tileMap.keys());
        try {
            for (var tileIds_1 = __values(tileIds), tileIds_1_1 = tileIds_1.next(); !tileIds_1_1.done; tileIds_1_1 = tileIds_1.next()) {
                var tileId = tileIds_1_1.value;
                this.removeVideoTile(tileId);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (tileIds_1_1 && !tileIds_1_1.done && (_a = tileIds_1.return)) _a.call(tileIds_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    DefaultVideoTileController.prototype.sendTileStateUpdate = function (tileState) {
        this.audioVideoController.forEachObserver(function (observer) {
            Maybe_1.default.of(observer.videoTileDidUpdate).map(function (f) { return f.bind(observer)(tileState); });
        });
    };
    DefaultVideoTileController.prototype.haveVideoTilesWithStreams = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this.getAllVideoTiles()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tile = _c.value;
                if (tile.state().boundVideoStream) {
                    return true;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return false;
    };
    DefaultVideoTileController.prototype.captureVideoTile = function (tileId) {
        var tile = this.getVideoTile(tileId);
        if (!tile) {
            return null;
        }
        return tile.capture();
    };
    DefaultVideoTileController.prototype.findOrCreateLocalVideoTile = function () {
        if (this.currentLocalTile) {
            return this.currentLocalTile;
        }
        this.currentLocalTile = this.addVideoTile(true);
        this.currentLocalTile.bindVideoStream(this.audioVideoController.configuration.credentials.attendeeId, true, null, null, null, null);
        return this.currentLocalTile;
    };
    return DefaultVideoTileController;
}());
exports.default = DefaultVideoTileController;
//# sourceMappingURL=DefaultVideoTileController.js.map