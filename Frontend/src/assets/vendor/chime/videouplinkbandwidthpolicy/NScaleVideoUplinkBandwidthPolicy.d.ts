import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import VideoCaptureAndEncodeParameters from './VideoCaptureAndEncodeParameters';
import VideoUplinkBandwidthPolicy from './VideoUplinkBandwidthPolicy';
/** NScaleVideoUplinkBandwidthPolicy implements capture and encode
 *  parameters that are nearly equivalent to those chosen by the
 *  traditional native clients, except for a modification to
 *  maxBandwidthKbps described below. */
export default class NScaleVideoUplinkBandwidthPolicy implements VideoUplinkBandwidthPolicy {
    private selfAttendeeId;
    private numParticipants;
    private optimalParameters;
    private parametersInEffect;
    private idealMaxBandwidthKbps;
    private hasBandwidthPriority;
    constructor(selfAttendeeId: string);
    updateIndex(videoIndex: VideoStreamIndex): void;
    wantsResubscribe(): boolean;
    chooseCaptureAndEncodeParameters(): VideoCaptureAndEncodeParameters;
    private captureWidth;
    private captureHeight;
    private captureFrameRate;
    maxBandwidthKbps(): number;
    setIdealMaxBandwidthKbps(idealMaxBandwidthKbps: number): void;
    setHasBandwidthPriority(hasBandwidthPriority: boolean): void;
}
