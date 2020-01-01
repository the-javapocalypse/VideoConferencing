"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * [[ScreenSharingMessageType]] Packet type enums
 */
var ScreenSharingMessageType;
(function (ScreenSharingMessageType) {
    ScreenSharingMessageType["UnknownType"] = "Unknown";
    ScreenSharingMessageType["HeartbeatRequestType"] = "HeartbeatRequest";
    ScreenSharingMessageType["HeartbeatResponseType"] = "HeartbeatResponse";
    ScreenSharingMessageType["StreamStart"] = "StreamStart";
    ScreenSharingMessageType["StreamEnd"] = "StreamEnd";
    ScreenSharingMessageType["StreamStop"] = "StreamStop";
    ScreenSharingMessageType["WebM"] = "WebM";
    ScreenSharingMessageType["PresenterSwitch"] = "PresenterSwitch";
})(ScreenSharingMessageType = exports.ScreenSharingMessageType || (exports.ScreenSharingMessageType = {}));
exports.default = ScreenSharingMessageType;
//# sourceMappingURL=ScreenSharingMessageType.js.map