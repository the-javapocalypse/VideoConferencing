"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
var VideoTileState_1 = require("./VideoTileState");
var DefaultVideoTile = /** @class */ (function () {
    function DefaultVideoTile(tileId, localTile, tileController, devicePixelRatioMonitor) {
        this.tileController = tileController;
        this.devicePixelRatioMonitor = devicePixelRatioMonitor;
        this.tileState = new VideoTileState_1.default();
        this.tileState.tileId = tileId;
        this.tileState.localTile = localTile;
        this.devicePixelRatioMonitor.registerObserver(this);
    }
    DefaultVideoTile.connectVideoStreamToVideoElement = function (videoStream, videoElement, localTile) {
        var transform = localTile ? 'rotateY(180deg)' : '';
        DefaultVideoTile.setVideoElementFlag(videoElement, 'disablePictureInPicture', localTile);
        DefaultVideoTile.setVideoElementFlag(videoElement, 'disableRemotePlayback', localTile);
        if (videoElement.style.transform !== transform) {
            videoElement.style.transform = transform;
        }
        if (videoElement.hasAttribute('controls')) {
            videoElement.removeAttribute('controls');
        }
        if (!videoElement.hasAttribute('autoplay')) {
            videoElement.setAttribute('autoplay', 'true');
        }
        if (!videoElement.hasAttribute('muted')) {
            videoElement.setAttribute('muted', 'true');
        }
        if (videoElement.srcObject !== videoStream) {
            videoElement.srcObject = videoStream;
        }
    };
    DefaultVideoTile.disconnectVideoStreamFromVideoElement = function (videoElement) {
        if (!videoElement) {
            return;
        }
        videoElement.srcObject = null;
        videoElement.style.transform = '';
        DefaultVideoTile.setVideoElementFlag(videoElement, 'disablePictureInPicture', false);
        DefaultVideoTile.setVideoElementFlag(videoElement, 'disableRemotePlayback', false);
    };
    DefaultVideoTile.prototype.destroy = function () {
        this.devicePixelRatioMonitor.removeObserver(this);
        DefaultVideoTile.disconnectVideoStreamFromVideoElement(this.tileState.boundVideoElement);
        this.tileState = new VideoTileState_1.default();
    };
    DefaultVideoTile.prototype.devicePixelRatioChanged = function (newDevicePixelRatio) {
        this.tileState.devicePixelRatio = newDevicePixelRatio;
        this.sendTileStateUpdate();
    };
    DefaultVideoTile.prototype.id = function () {
        return this.tileState.tileId;
    };
    DefaultVideoTile.prototype.state = function () {
        return this.tileState.clone();
    };
    DefaultVideoTile.prototype.stateRef = function () {
        return this.tileState;
    };
    DefaultVideoTile.prototype.bindVideoStream = function (attendeeId, localTile, mediaStream, contentWidth, contentHeight, streamId) {
        var tileUpdated = false;
        if (this.tileState.boundAttendeeId !== attendeeId) {
            this.tileState.boundAttendeeId = attendeeId;
            tileUpdated = true;
        }
        if (this.tileState.localTile !== localTile) {
            this.tileState.localTile = localTile;
            tileUpdated = true;
        }
        if (this.tileState.boundVideoStream !== mediaStream) {
            this.tileState.boundVideoStream = mediaStream;
            tileUpdated = true;
        }
        if (this.tileState.videoStreamContentWidth !== contentWidth) {
            this.tileState.videoStreamContentWidth = contentWidth;
            tileUpdated = true;
        }
        if (this.tileState.videoStreamContentHeight !== contentHeight) {
            this.tileState.videoStreamContentHeight = contentHeight;
            tileUpdated = true;
        }
        if (this.tileState.streamId !== streamId) {
            this.tileState.streamId = streamId;
            tileUpdated = true;
        }
        if (tileUpdated) {
            this.sendTileStateUpdate();
        }
    };
    DefaultVideoTile.prototype.bindVideoElement = function (videoElement) {
        var tileUpdated = false;
        if (this.tileState.boundVideoElement !== videoElement) {
            this.tileState.boundVideoElement = videoElement;
            tileUpdated = true;
        }
        if (this.tileState.boundVideoElement !== null) {
            if (this.tileState.videoElementCSSWidthPixels !== videoElement.clientWidth) {
                this.tileState.videoElementCSSWidthPixels = videoElement.clientWidth;
                tileUpdated = true;
            }
            if (this.tileState.videoElementCSSHeightPixels !== videoElement.clientHeight) {
                this.tileState.videoElementCSSHeightPixels = videoElement.clientHeight;
                tileUpdated = true;
            }
        }
        else {
            this.tileState.videoElementCSSWidthPixels = null;
            this.tileState.videoElementCSSHeightPixels = null;
        }
        if (tileUpdated) {
            this.sendTileStateUpdate();
        }
    };
    DefaultVideoTile.prototype.pause = function () {
        if (!this.tileState.paused) {
            this.tileState.paused = true;
            this.sendTileStateUpdate();
        }
    };
    DefaultVideoTile.prototype.unpause = function () {
        if (this.tileState.paused) {
            this.tileState.paused = false;
            this.sendTileStateUpdate();
        }
    };
    DefaultVideoTile.prototype.markPoorConnection = function () {
        if (this.tileState.poorConnection) {
            return false;
        }
        this.tileState.poorConnection = true;
        this.sendTileStateUpdate();
        return true;
    };
    DefaultVideoTile.prototype.unmarkPoorConnection = function () {
        if (!this.tileState.poorConnection) {
            return false;
        }
        this.tileState.poorConnection = false;
        this.sendTileStateUpdate();
        return true;
    };
    DefaultVideoTile.prototype.capture = function () {
        if (!this.tileState.active) {
            return null;
        }
        var canvas = document.createElement('canvas');
        var video = this.tileState.boundVideoElement;
        canvas.width = video.videoWidth || video.width;
        canvas.height = video.videoHeight || video.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    DefaultVideoTile.prototype.sendTileStateUpdate = function () {
        this.updateActiveState();
        this.updateVideoStreamOnVideoElement();
        this.updateVideoElementPhysicalPixels();
        this.tileController.sendTileStateUpdate(this.state());
    };
    DefaultVideoTile.prototype.updateActiveState = function () {
        this.tileState.active = !!(!this.tileState.paused &&
            !this.tileState.poorConnection &&
            this.tileState.boundAttendeeId &&
            this.tileState.boundVideoElement &&
            this.tileState.boundVideoStream);
    };
    DefaultVideoTile.prototype.updateVideoElementPhysicalPixels = function () {
        if (typeof this.tileState.videoElementCSSWidthPixels === 'number' &&
            typeof this.tileState.videoElementCSSHeightPixels === 'number') {
            this.tileState.videoElementPhysicalWidthPixels =
                this.tileState.devicePixelRatio * this.tileState.videoElementCSSWidthPixels;
            this.tileState.videoElementPhysicalHeightPixels =
                this.tileState.devicePixelRatio * this.tileState.videoElementCSSHeightPixels;
        }
        else {
            this.tileState.videoElementPhysicalWidthPixels = null;
            this.tileState.videoElementPhysicalHeightPixels = null;
        }
    };
    DefaultVideoTile.prototype.updateVideoStreamOnVideoElement = function () {
        if (this.tileState.active) {
            DefaultVideoTile.connectVideoStreamToVideoElement(this.tileState.boundVideoStream, this.tileState.boundVideoElement, this.tileState.localTile);
        }
        else {
            DefaultVideoTile.disconnectVideoStreamFromVideoElement(this.tileState.boundVideoElement);
        }
    };
    DefaultVideoTile.setVideoElementFlag = function (videoElement, flag, value) {
        if (flag in videoElement) {
            // @ts-ignore
            videoElement[flag] = value;
        }
    };
    return DefaultVideoTile;
}());
exports.default = DefaultVideoTile;
//# sourceMappingURL=DefaultVideoTile.js.map