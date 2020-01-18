import VideoStreamIdSet from '../videostreamidset/VideoStreamIdSet';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import VideoTileController from '../videotilecontroller/VideoTileController';
import VideoDownlinkBandwidthPolicy from './VideoDownlinkBandwidthPolicy';
export default class VideoAdaptiveSubscribePolicy implements VideoDownlinkBandwidthPolicy {
    private selfAttendeeId;
    private tileController;
    private optimalReceiveSet;
    private subscribedReceiveSet;
    private bandwidthLimitationKbps;
    private videoIndex;
    private static readonly LOW_RESOLUTION_TILE_AREA_IN_PHYSICAL_PIXELS;
    private static readonly HIGH_RESOLUTION_TILE_AREA_IN_PHYSICAL_PIXELS;
    private static readonly DEFAULT_BANDWIDTH_KBPS;
    constructor(selfAttendeeId: string, tileController: VideoTileController);
    updateIndex(videoIndex: VideoStreamIndex): void;
    updateAvailableBandwidth(bandwidthKbps: number): void;
    updateCalculatedOptimalReceiveSet(): void;
    wantsResubscribe(): boolean;
    chooseSubscriptions(): VideoStreamIdSet;
    private calculateOptimalReceiveSet;
    private shouldBeLowResolution;
    private shouldBeHighResolution;
}
