"use strict";
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var FullJitterBackoffFactory_1 = require("../backoff/FullJitterBackoffFactory");
var DefaultDOMWebSocketFactory_1 = require("../domwebsocket/DefaultDOMWebSocketFactory");
var DefaultDragObserver_1 = require("../dragobserver/DefaultDragObserver");
var DefaultPromisedWebSocketFactory_1 = require("../promisedwebsocket/DefaultPromisedWebSocketFactory");
var ReconnectingPromisedWebSocketFactory_1 = require("../promisedwebsocket/ReconnectingPromisedWebSocketFactory");
var ResizeObserverAdapterFactory_1 = require("../resizeobserveradapter/ResizeObserverAdapterFactory");
var ScreenSignalingSessionContainer_1 = require("../screensignalingsession/ScreenSignalingSessionContainer");
var DefaultScreenViewingComponentContext_1 = require("../screenviewing/context/DefaultScreenViewingComponentContext");
var DefaultScreenViewing_1 = require("../screenviewing/DefaultScreenViewing");
var ScreenViewingSessionConnectionRequest_1 = require("../screenviewing/session/ScreenViewingSessionConnectionRequest");
var DefaultScreenShareViewFacade = /** @class */ (function () {
    function DefaultScreenShareViewFacade(configuration, logger) {
        this.configuration = configuration;
        this.logger = logger;
        var reconnectingWSFactory = new ReconnectingPromisedWebSocketFactory_1.default(new DefaultPromisedWebSocketFactory_1.default(new DefaultDOMWebSocketFactory_1.default()), new FullJitterBackoffFactory_1.default(1000, 100, 300));
        this.screenViewing = new DefaultScreenViewing_1.default(new DefaultScreenViewingComponentContext_1.default(new ResizeObserverAdapterFactory_1.default(), function (window, callback, element) {
            return new DefaultDragObserver_1.default(window, element, callback);
        }, reconnectingWSFactory, new ScreenSignalingSessionContainer_1.default(reconnectingWSFactory, logger).screenSignalingSessionFactory(), this.logger, {}, window));
    }
    DefaultScreenShareViewFacade.prototype.open = function () {
        return __awaiter(this, void 0, void 0, function () {
            var connectionRequest;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connectionRequest = new ScreenViewingSessionConnectionRequest_1.default(this.configuration.urls.screenViewingURL, this.configuration.urls.screenDataURL, this.configuration.credentials.joinToken, this.configuration.screenViewingTimeoutMs);
                        return [4 /*yield*/, this.screenViewing.open(connectionRequest)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DefaultScreenShareViewFacade.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.screenViewing.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DefaultScreenShareViewFacade.prototype.start = function (element) {
        return this.screenViewing.start(element);
    };
    DefaultScreenShareViewFacade.prototype.stop = function () {
        this.screenViewing.stop();
    };
    DefaultScreenShareViewFacade.prototype.presentScaleToFit = function () {
        this.screenViewing.presentScaleToFit();
    };
    DefaultScreenShareViewFacade.prototype.presentDragAndZoom = function () {
        this.screenViewing.presentDragAndZoom();
    };
    DefaultScreenShareViewFacade.prototype.zoomIn = function (relativeZoomFactor) {
        this.screenViewing.zoomIn(relativeZoomFactor);
    };
    DefaultScreenShareViewFacade.prototype.zoomOut = function (relativeZoomFactor) {
        this.screenViewing.zoomOut(relativeZoomFactor);
    };
    DefaultScreenShareViewFacade.prototype.zoom = function (absoluteZoomFactor) {
        this.screenViewing.zoom(absoluteZoomFactor);
    };
    DefaultScreenShareViewFacade.prototype.zoomReset = function () {
        this.screenViewing.zoomReset();
    };
    DefaultScreenShareViewFacade.prototype.registerObserver = function (observer) {
        this.screenViewing.registerObserver(observer);
    };
    DefaultScreenShareViewFacade.prototype.unregisterObserver = function (observer) {
        this.screenViewing.unregisterObserver(observer);
    };
    return DefaultScreenShareViewFacade;
}());
exports.default = DefaultScreenShareViewFacade;
//# sourceMappingURL=DefaultScreenShareViewFacade.js.map