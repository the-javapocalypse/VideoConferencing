/**
 * [[DeviceChangeObserver]] can be registered with a [[DeviceController]] to receive callbacks on device change events.
 */
export default interface DeviceChangeObserver {
    /**
     * Called when audio inputs are changed.
     */
    audioInputsChanged?(freshAudioInputDeviceList?: MediaDeviceInfo[]): void;
    /**
     * Called when audio outputs are changed.
     */
    audioOutputsChanged?(freshAudioOutputDeviceList?: MediaDeviceInfo[]): void;
    /**
     * Called when video inputs are changed.
     */
    videoInputsChanged?(freshVideoInputDeviceList?: MediaDeviceInfo[]): void;
}
