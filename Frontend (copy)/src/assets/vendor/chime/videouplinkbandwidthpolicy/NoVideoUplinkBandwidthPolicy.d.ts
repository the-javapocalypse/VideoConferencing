import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import VideoCaptureAndEncodeParameters from '../videouplinkbandwidthpolicy/VideoCaptureAndEncodeParameters';
import VideoUplinkBandwidthPolicy from '../videouplinkbandwidthpolicy/VideoUplinkBandwidthPolicy';
export default class NoVideoUplinkBandwidthPolicy implements VideoUplinkBandwidthPolicy {
    constructor();
    updateIndex(_videoIndex: VideoStreamIndex): void;
    wantsResubscribe(): boolean;
    chooseCaptureAndEncodeParameters(): VideoCaptureAndEncodeParameters;
    maxBandwidthKbps(): number;
    setIdealMaxBandwidthKbps(_idealMaxBandwidthKbps: number): void;
    setHasBandwidthPriority(_hasBandwidthPriority: boolean): void;
}
