import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import Logger from '../logger/Logger';
import VideoTile from '../videotile/VideoTile';
import VideoTileState from '../videotile/VideoTileState';
import VideoTileFactory from '../videotilefactory/VideoTileFactory';
import VideoTileController from './VideoTileController';
export default class DefaultVideoTileController implements VideoTileController {
    private tileFactory;
    private audioVideoController;
    private logger;
    private tileMap;
    private nextTileId;
    private currentLocalTile;
    private devicePixelRatioMonitor;
    constructor(tileFactory: VideoTileFactory, audioVideoController: AudioVideoController, logger: Logger);
    bindVideoElement(tileId: number, videoElement: HTMLVideoElement | null): void;
    unbindVideoElement(tileId: number): void;
    startLocalVideoTile(): number;
    stopLocalVideoTile(): void;
    hasStartedLocalVideoTile(): boolean;
    removeLocalVideoTile(): void;
    getLocalVideoTile(): VideoTile | null;
    pauseVideoTile(tileId: number): void;
    unpauseVideoTile(tileId: number): void;
    getVideoTile(tileId: number): VideoTile | null;
    getVideoTileArea(tile: VideoTile): number;
    getAllRemoteVideoTiles(): VideoTile[];
    getAllVideoTiles(): VideoTile[];
    addVideoTile(localTile?: boolean): VideoTile;
    removeVideoTile(tileId: number): void;
    removeVideoTilesByAttendeeId(attendeeId: string): number[];
    removeAllVideoTiles(): void;
    sendTileStateUpdate(tileState: VideoTileState): void;
    haveVideoTilesWithStreams(): boolean;
    captureVideoTile(tileId: number): ImageData | null;
    private findOrCreateLocalVideoTile;
}