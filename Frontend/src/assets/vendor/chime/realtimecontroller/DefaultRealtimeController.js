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
var RealtimeState_1 = require("./RealtimeState");
var RealtimeVolumeIndicator_1 = require("./RealtimeVolumeIndicator");
/**
 * [[DefaultRealtimeController]] is written to adhere to the following tenets to
 * make privacy and performance bugs significantly less likely.
 *
 * 1. Any call to the object is guaranteed to succeed from the caller's
 *    perspective to the maximum extent that this can be ensured. However, all
 *    failures of the object are reported as fatal errors. For example, if local
 *    mute fails, then that is a privacy issue and we must tear down the
 *    connection and try starting over.
 *
 * 2. State is owned by the object and is considered authoritative at all times.
 *    For example, if [[realtimeIsLocalAudioMuted]] is true then the user *is*
 *    muted.
 *
 * 3. Callbacks are fired synchronously and do their work synchronously. Any
 *    unnecessary asynchronous implementation only invites latency and
 *    increases the surface error for potential errors.
 *
 * 4. Mutation only occurs when state changes. All state-changing functions are
 *    idempotent.
 *
 * 5. Every conditional branch gets its own if statement and test coverage is
 *    100% for this object.
 *
 * 6. Function parameters and returns use primitives only (no classes or enums).
 *    This minimizes the number of dependencies that consumers have to take on
 *    and allows the object to be more easily wrapped. Values are normalized
 *    where possible.
 *
 * 7. The object takes no other non-realtime dependencies.
 *
 * 8. Interface functions begin with `realtime` to make boundaries between the
 *    RealtimeController interface and the UI or business logic explicit and
 *    auditable.
 *
 * 9. Local state overrides remote state but not vice-versa. For example, if
 *    locally muted with an active audio input and a remote state indicates the
 *    same user is unmuted because the muted state has not yet propagated, then
 *    the volume indicator update for the user would show the remote mute state
 *    as muted. However, if locally muted without an active audio input and a
 *    remote state indicates the user is unmuted (since they are dialed in), the
 *    remote state persists but does not override the local state so
 *    [[realtimeIsLocalAudioMuted]] still returns true.
 */
var DefaultRealtimeController = /** @class */ (function () {
    function DefaultRealtimeController() {
        // Attendee Id
        this.state = new RealtimeState_1.default();
    }
    DefaultRealtimeController.prototype.realtimeSetLocalAttendeeId = function (attendeeId) {
        var _this = this;
        this.wrap(function () {
            _this.state.localAttendeeId = attendeeId;
        });
    };
    DefaultRealtimeController.prototype.realtimeSetAttendeeIdPresence = function (attendeeId, present) {
        var _this = this;
        this.wrap(function () {
            var e_1, _a;
            try {
                for (var _b = __values(_this.state.attendeeIdChangesCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var fn = _c.value;
                    fn(attendeeId, present);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    };
    DefaultRealtimeController.prototype.realtimeSubscribeToAttendeeIdPresence = function (callback) {
        var _this = this;
        this.wrap(function () {
            _this.state.attendeeIdChangesCallbacks.push(callback);
        });
    };
    DefaultRealtimeController.prototype.realtimeUnsubscribeToAttendeeIdPresence = function (callback) {
        var _this = this;
        this.wrap(function () {
            var index = _this.state.attendeeIdChangesCallbacks.indexOf(callback);
            if (index !== -1) {
                _this.state.attendeeIdChangesCallbacks.splice(index, 1);
            }
        });
    };
    // Audio Input
    DefaultRealtimeController.prototype.realtimeSetLocalAudioInput = function (audioInput) {
        var _this = this;
        this.wrap(function () {
            if (_this.state.audioInput === audioInput) {
                return;
            }
            _this.setAudioInputEnabled(false);
            _this.state.audioInput = audioInput;
            _this.setAudioInputEnabled(!_this.state.muted);
        });
    };
    // Muting
    DefaultRealtimeController.prototype.realtimeSetCanUnmuteLocalAudio = function (canUnmute) {
        var _this = this;
        this.wrap(function () {
            var e_2, _a;
            if (_this.state.canUnmute === canUnmute) {
                return;
            }
            _this.state.canUnmute = canUnmute;
            try {
                for (var _b = __values(_this.state.setCanUnmuteLocalAudioCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var fn = _c.value;
                    fn(canUnmute);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    };
    DefaultRealtimeController.prototype.realtimeSubscribeToSetCanUnmuteLocalAudio = function (callback) {
        var _this = this;
        this.wrap(function () {
            _this.state.setCanUnmuteLocalAudioCallbacks.push(callback);
        });
    };
    DefaultRealtimeController.prototype.realtimeUnsubscribeToSetCanUnmuteLocalAudio = function (callback) {
        var _this = this;
        this.wrap(function () {
            var index = _this.state.setCanUnmuteLocalAudioCallbacks.indexOf(callback);
            if (index !== -1) {
                _this.state.setCanUnmuteLocalAudioCallbacks.splice(index, 1);
            }
        });
    };
    DefaultRealtimeController.prototype.realtimeCanUnmuteLocalAudio = function () {
        var _this = this;
        var result = false;
        this.wrap(function () {
            result = _this.state.canUnmute;
        });
        return result;
    };
    DefaultRealtimeController.prototype.realtimeMuteLocalAudio = function () {
        var _this = this;
        this.wrap(function () {
            var e_3, _a;
            if (_this.state.muted) {
                return;
            }
            _this.setAudioInputEnabled(false);
            _this.state.muted = true;
            _this.realtimeUpdateVolumeIndicator(_this.state.localAttendeeId, null, null, null);
            try {
                for (var _b = __values(_this.state.muteAndUnmuteLocalAudioCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var fn = _c.value;
                    fn(true);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        });
    };
    DefaultRealtimeController.prototype.realtimeUnmuteLocalAudio = function () {
        var _this = this;
        var result = false;
        this.wrap(function () {
            var e_4, _a;
            if (!_this.state.muted) {
                result = true;
                return;
            }
            if (!_this.state.canUnmute) {
                result = false;
                return;
            }
            _this.setAudioInputEnabled(true);
            _this.state.muted = false;
            _this.realtimeUpdateVolumeIndicator(_this.state.localAttendeeId, null, null, null);
            try {
                for (var _b = __values(_this.state.muteAndUnmuteLocalAudioCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var fn = _c.value;
                    fn(false);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            result = true;
        });
        return result;
    };
    DefaultRealtimeController.prototype.realtimeSubscribeToMuteAndUnmuteLocalAudio = function (callback) {
        var _this = this;
        this.wrap(function () {
            _this.state.muteAndUnmuteLocalAudioCallbacks.push(callback);
        });
    };
    DefaultRealtimeController.prototype.realtimeUnsubscribeToMuteAndUnmuteLocalAudio = function (callback) {
        var _this = this;
        this.wrap(function () {
            var index = _this.state.muteAndUnmuteLocalAudioCallbacks.indexOf(callback);
            if (index !== -1) {
                _this.state.muteAndUnmuteLocalAudioCallbacks.splice(index, 1);
            }
        });
    };
    DefaultRealtimeController.prototype.realtimeIsLocalAudioMuted = function () {
        var _this = this;
        var result = false;
        this.wrap(function () {
            result = _this.state.muted;
        });
        return result;
    };
    // Volume Indicators
    DefaultRealtimeController.prototype.realtimeSubscribeToVolumeIndicator = function (attendeeId, callback) {
        var _this = this;
        this.wrap(function () {
            if (!_this.state.volumeIndicatorCallbacks.hasOwnProperty(attendeeId)) {
                _this.state.volumeIndicatorCallbacks[attendeeId] = [];
            }
            _this.state.volumeIndicatorCallbacks[attendeeId].push(callback);
            _this.sendVolumeIndicatorChange(attendeeId, true, true, true);
        });
    };
    DefaultRealtimeController.prototype.realtimeUnsubscribeFromVolumeIndicator = function (attendeeId) {
        var _this = this;
        this.wrap(function () {
            delete _this.state.volumeIndicatorCallbacks[attendeeId];
        });
    };
    DefaultRealtimeController.prototype.realtimeUpdateVolumeIndicator = function (attendeeId, volume, muted, signalStrength) {
        var _this = this;
        this.wrap(function () {
            muted = _this.applyLocalMuteOverride(attendeeId, muted);
            var state = _this.getVolumeIndicatorState(attendeeId);
            var volumeUpdated = false;
            var mutedUpdated = false;
            var signalStrengthUpdated = false;
            if (muted !== null) {
                if (state.muted !== muted) {
                    state.muted = muted;
                    mutedUpdated = true;
                    if (state.muted && state.volume !== 0.0) {
                        state.volume = 0.0;
                        volumeUpdated = true;
                    }
                }
            }
            if (!state.muted && volume !== null) {
                if (state.volume !== volume) {
                    state.volume = volume;
                    volumeUpdated = true;
                }
                if (state.muted === null) {
                    state.muted = false;
                    mutedUpdated = true;
                }
            }
            if (signalStrength !== null) {
                if (state.signalStrength !== signalStrength) {
                    state.signalStrength = signalStrength;
                    signalStrengthUpdated = true;
                }
            }
            _this.sendVolumeIndicatorChange(attendeeId, volumeUpdated, mutedUpdated, signalStrengthUpdated);
        });
    };
    DefaultRealtimeController.prototype.realtimeSubscribeToLocalSignalStrengthChange = function (callback) {
        var _this = this;
        this.wrap(function () {
            _this.state.localSignalStrengthChangeCallbacks.push(callback);
            if (_this.state.localAttendeeId === null) {
                return;
            }
            _this.sendLocalSignalStrengthChange(_this.state.localAttendeeId, true);
        });
    };
    DefaultRealtimeController.prototype.realtimeUnsubscribeToLocalSignalStrengthChange = function (callback) {
        var _this = this;
        this.wrap(function () {
            var index = _this.state.localSignalStrengthChangeCallbacks.indexOf(callback);
            if (index !== -1) {
                _this.state.localSignalStrengthChangeCallbacks.splice(index, 1);
            }
        });
    };
    // Error Handling
    DefaultRealtimeController.prototype.realtimeSubscribeToFatalError = function (callback) {
        var _this = this;
        this.wrap(function () {
            _this.state.fatalErrorCallbacks.push(callback);
        });
    };
    DefaultRealtimeController.prototype.realtimeUnsubscribeToFatalError = function (callback) {
        var _this = this;
        this.wrap(function () {
            var index = _this.state.fatalErrorCallbacks.indexOf(callback);
            if (index !== -1) {
                _this.state.fatalErrorCallbacks.splice(index, 1);
            }
        });
    };
    // Internals
    DefaultRealtimeController.prototype.setAudioInputEnabled = function (enabled) {
        var e_5, _a;
        if (!this.state.audioInput) {
            return;
        }
        try {
            for (var _b = __values(this.state.audioInput.getTracks()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var track = _c.value;
                if (track.enabled === enabled) {
                    continue;
                }
                track.enabled = enabled;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    DefaultRealtimeController.prototype.applyLocalMuteOverride = function (attendeeIdRemote, mutedRemote) {
        var attendeeIdLocal = this.state.localAttendeeId;
        var mutedLocal = this.state.muted;
        if (attendeeIdRemote !== attendeeIdLocal) {
            return mutedRemote;
        }
        if (this.state.audioInput === null) {
            return mutedRemote;
        }
        return mutedLocal;
    };
    DefaultRealtimeController.prototype.sendVolumeIndicatorChange = function (attendeeId, volumeUpdated, mutedUpdated, signalStrengthUpdated) {
        var e_6, _a;
        this.sendLocalSignalStrengthChange(attendeeId, signalStrengthUpdated);
        if (!this.state.volumeIndicatorCallbacks.hasOwnProperty(attendeeId)) {
            return;
        }
        var state = this.getVolumeIndicatorState(attendeeId);
        var updateState = new RealtimeVolumeIndicator_1.default();
        if (volumeUpdated) {
            updateState.volume = state.volume;
        }
        if (mutedUpdated) {
            updateState.muted = state.muted;
        }
        if (signalStrengthUpdated) {
            updateState.signalStrength = state.signalStrength;
        }
        if (this.stateIsEmpty(updateState)) {
            return;
        }
        try {
            for (var _b = __values(this.state.volumeIndicatorCallbacks[attendeeId]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var fn = _c.value;
                fn(attendeeId, updateState.volume, updateState.muted, updateState.signalStrength);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    DefaultRealtimeController.prototype.sendLocalSignalStrengthChange = function (attendeeId, signalStrengthUpdated) {
        var e_7, _a;
        if (!signalStrengthUpdated) {
            return;
        }
        if (attendeeId !== this.state.localAttendeeId) {
            return;
        }
        var state = this.getVolumeIndicatorState(attendeeId);
        var signalStrength = state.signalStrength;
        if (signalStrength === null) {
            return;
        }
        try {
            for (var _b = __values(this.state.localSignalStrengthChangeCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                var fn = _c.value;
                fn(signalStrength);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    DefaultRealtimeController.prototype.getVolumeIndicatorState = function (id) {
        if (!this.state.volumeIndicatorState.hasOwnProperty(id)) {
            this.state.volumeIndicatorState[id] = new RealtimeVolumeIndicator_1.default();
        }
        return this.state.volumeIndicatorState[id];
    };
    DefaultRealtimeController.prototype.stateIsEmpty = function (state) {
        return state.volume === null && state.muted === null && state.signalStrength === null;
    };
    DefaultRealtimeController.prototype.wrap = function (fn) {
        var e_8, _a;
        try {
            fn();
        }
        catch (error) {
            try {
                try {
                    // 1) try the fatal error callbacks so that the issue is reported in
                    //    logs and to give the handler a chance to clean up and reset.
                    for (var _b = __values(this.state.fatalErrorCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var fn_1 = _c.value;
                        fn_1(error);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
            }
            catch (eventError) {
                try {
                    // 2) if the error event fails, fall back to console.error so that
                    //    it at least prints out to the console before moving on.
                    console.error(error);
                    console.error(eventError);
                }
                catch (consoleError) {
                    // 3) if all else fails, swallow the error and give up to guarantee
                    //    that the API call returns cleanly.
                }
            }
        }
    };
    return DefaultRealtimeController;
}());
exports.default = DefaultRealtimeController;
//# sourceMappingURL=DefaultRealtimeController.js.map