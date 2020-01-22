export default class VideoCaptureAndEncodeParameters {
    captureWidth: number;
    captureHeight: number;
    captureFrameRate: number;
    maxEncodeBitrateKbps: number;
    constructor(captureWidth?: number, captureHeight?: number, captureFrameRate?: number, maxEncodeBitrateKbps?: number);
    equal(other: VideoCaptureAndEncodeParameters): boolean;
    clone(): VideoCaptureAndEncodeParameters;
}
