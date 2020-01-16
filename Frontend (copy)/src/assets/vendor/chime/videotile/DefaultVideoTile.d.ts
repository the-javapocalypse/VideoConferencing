import DevicePixelRatioMonitor from '../devicepixelratiomonitor/DevicePixelRatioMonitor';
import DevicePixelRatioObserver from '../devicepixelratioobserver/DevicePixelRatioObserver';
import VideoTileController from '../videotilecontroller/VideoTileController';
import VideoTile from './VideoTile';
import VideoTileState from './VideoTileState';
export default class DefaultVideoTile implements DevicePixelRatioObserver, VideoTile {
    private tileController;
    private devicePixelRatioMonitor;
    private tileState;
    static connectVideoStreamToVideoElement(videoStream: MediaStream, videoElement: HTMLVideoElement, localTile: boolean): void;
    static disconnectVideoStreamFromVideoElement(videoElement: HTMLVideoElement | null): void;
    constructor(tileId: number, localTile: boolean, tileController: VideoTileController, devicePixelRatioMonitor: DevicePixelRatioMonitor);
    destroy(): void;
    devicePixelRatioChanged(newDevicePixelRatio: number): void;
    id(): number;
    state(): VideoTileState;
    stateRef(): VideoTileState;
    bindVideoStream(attendeeId: string, localTile: boolean, mediaStream: MediaStream | null, contentWidth: number | null, contentHeight: number | null, streamId: number | null): void;
    bindVideoElement(videoElement: HTMLVideoElement | null): void;
    pause(): void;
    unpause(): void;
    markPoorConnection(): boolean;
    unmarkPoorConnection(): boolean;
    capture(): ImageData | null;
    private sendTileStateUpdate;
    private updateActiveState;
    private updateVideoElementPhysicalPixels;
    private updateVideoStreamOnVideoElement;
    private static setVideoElementFlag;
}