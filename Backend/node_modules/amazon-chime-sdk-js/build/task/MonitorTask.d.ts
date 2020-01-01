import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import AudioVideoObserver from '../audiovideoobserver/AudioVideoObserver';
import ConnectionHealthData from '../connectionhealthpolicy/ConnectionHealthData';
import RemovableObserver from '../removableobserver/RemovableObserver';
import SignalingClientEvent from '../signalingclient/SignalingClientEvent';
import SignalingClientObserver from '../signalingclientobserver/SignalingClientObserver';
import BaseTask from './BaseTask';
export default class MonitorTask extends BaseTask implements AudioVideoObserver, RemovableObserver, SignalingClientObserver {
    private context;
    private initialConnectionHealthData;
    protected taskName: string;
    private reconnectionHealthPolicy;
    private unusableAudioWarningHealthPolicy;
    private signalStrengthBarsHealthPolicy;
    private prevSignalStrength;
    private static DEFAULT_TIMEOUT_FOR_START_SENDING_VIDEO_MS;
    constructor(context: AudioVideoControllerState, initialConnectionHealthData: ConnectionHealthData);
    removeObserver(): void;
    run(): Promise<void>;
    videoSendHealthDidChange(bitrateKbps: number, packetsPerSecond: number): void;
    videoReceiveBandwidthDidChange(newBandwidthKbps: number, oldBandwidthKbps: number): void;
    connectionHealthDidChange(connectionHealthData: ConnectionHealthData): void;
    handleSignalingClientEvent(event: SignalingClientEvent): void;
    private checkAndSendWeakSignalEvent;
    private realtimeFatalErrorCallback;
}
