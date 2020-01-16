import ActiveSpeakerDetector from '../activespeakerdetector/ActiveSpeakerDetector';
import AudioMixController from '../audiomixcontroller/AudioMixController';
import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import AudioVideoFacade from '../audiovideofacade/AudioVideoFacade';
import AudioVideoObserver from '../audiovideoobserver/AudioVideoObserver';
import DeviceController from '../devicecontroller/DeviceController';
import Logger from '../logger/Logger';
import DeviceControllerBasedMediaStreamBroker from '../mediastreambroker/DeviceControllerBasedMediaStreamBroker';
import MediaStreamBroker from '../mediastreambroker/MediaStreamBroker';
import MeetingSessionConfiguration from '../meetingsession/MeetingSessionConfiguration';
import MeetingSessionStatus from '../meetingsession/MeetingSessionStatus';
import RealtimeController from '../realtimecontroller/RealtimeController';
import ReconnectController from '../reconnectcontroller/ReconnectController';
import VideoTileController from '../videotilecontroller/VideoTileController';
import WebSocketAdapter from '../websocketadapter/WebSocketAdapter';
export default class DefaultAudioVideoController implements AudioVideoController {
    private _facade;
    private _logger;
    private _configuration;
    private _webSocketAdapter;
    private _realtimeController;
    private _activeSpeakerDetector;
    private _videoTileController;
    private _deviceController;
    private _reconnectController;
    private _audioMixController;
    private connectionHealthData;
    private observerQueue;
    private meetingSessionContext;
    private sessionStateController;
    private static MIN_VOLUME_DECIBELS;
    private static MAX_VOLUME_DECIBELS;
    private static PING_PONG_INTERVAL_MS;
    constructor(configuration: MeetingSessionConfiguration, logger: Logger, webSocketAdapter: WebSocketAdapter, deviceController: DeviceControllerBasedMediaStreamBroker, reconnectController: ReconnectController);
    get configuration(): MeetingSessionConfiguration;
    get realtimeController(): RealtimeController;
    get activeSpeakerDetector(): ActiveSpeakerDetector;
    get videoTileController(): VideoTileController;
    get audioMixController(): AudioMixController;
    get facade(): AudioVideoFacade;
    get logger(): Logger;
    get rtcPeerConnection(): RTCPeerConnection | null;
    get mediaStreamBroker(): MediaStreamBroker;
    get deviceController(): DeviceController;
    addObserver(observer: AudioVideoObserver): void;
    removeObserver(observer: AudioVideoObserver): void;
    forEachObserver(observerFunc: (observer: AudioVideoObserver) => void): void;
    start(): void;
    private actionConnect;
    private actionFinishConnecting;
    stop(): void;
    private actionDisconnect;
    update(): boolean;
    restartLocalVideo(callback: () => void): boolean;
    private actionUpdate;
    private actionFinishUpdating;
    reconnect(status: MeetingSessionStatus): boolean;
    private actionReconnect;
    private getMeetingStatusCode;
    private enforceBandwidthLimitationForSender;
    handleMeetingSessionStatus(status: MeetingSessionStatus): boolean;
    setVideoMaxBandwidthKbps(maxBandwidthKbps: number): void;
    handleHasBandwidthPriority(hasBandwidthPriority: boolean): void;
}