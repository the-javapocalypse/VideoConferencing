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
var MeetingSessionTURNCredentials_1 = require("../meetingsession/MeetingSessionTURNCredentials");
var Versioning_1 = require("../versioning/Versioning");
var BaseTask_1 = require("./BaseTask");
/*
 * [[ReceiveTURNCredentialsTask]] asynchronously retrieves TURN credentials.
 */
var ReceiveTURNCredentialsTask = /** @class */ (function (_super) {
    __extends(ReceiveTURNCredentialsTask, _super);
    function ReceiveTURNCredentialsTask(context) {
        var _this = _super.call(this, context.logger) || this;
        _this.context = context;
        _this.taskName = 'ReceiveTURNCredentialsTask';
        _this.url = context.meetingSessionConfiguration.urls.turnControlURL;
        _this.meetingId = context.meetingSessionConfiguration.meetingId;
        _this.joinToken = context.meetingSessionConfiguration.credentials.joinToken;
        return _this;
    }
    ReceiveTURNCredentialsTask.prototype.cancel = function () {
        var error = new Error("canceling " + this.name());
        this.cancelPromise && this.cancelPromise(error);
    };
    ReceiveTURNCredentialsTask.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options, responseBodyJson;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-cache',
                            credentials: 'omit',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Chime-Auth-Token': '_aws_wt_session=' + this.joinToken,
                            },
                            redirect: 'follow',
                            referrer: 'no-referrer',
                            body: JSON.stringify({ meetingId: this.meetingId }),
                        };
                        this.context.logger.info("requesting TURN credentials from " + this.url);
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var responseBody, _a, error_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            this.cancelPromise = function (error) {
                                                reject(error);
                                            };
                                            _b.label = 1;
                                        case 1:
                                            _b.trys.push([1, 4, , 5]);
                                            return [4 /*yield*/, fetch(Versioning_1.default.urlWithVersion(this.url), options)];
                                        case 2:
                                            responseBody = _b.sent();
                                            this.context.logger.info("received TURN credentials");
                                            _a = resolve;
                                            return [4 /*yield*/, responseBody.json()];
                                        case 3:
                                            _a.apply(void 0, [_b.sent()]);
                                            return [3 /*break*/, 5];
                                        case 4:
                                            error_1 = _b.sent();
                                            reject(error_1);
                                            return [3 /*break*/, 5];
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        responseBodyJson = _a.sent();
                        this.context.turnCredentials = new MeetingSessionTURNCredentials_1.default();
                        this.context.turnCredentials.password = responseBodyJson.password;
                        this.context.turnCredentials.ttl = responseBodyJson.ttl;
                        this.context.turnCredentials.uris = responseBodyJson.uris;
                        this.context.turnCredentials.username = responseBodyJson.username;
                        return [2 /*return*/];
                }
            });
        });
    };
    return ReceiveTURNCredentialsTask;
}(BaseTask_1.default));
exports.default = ReceiveTURNCredentialsTask;
//# sourceMappingURL=ReceiveTURNCredentialsTask.js.map