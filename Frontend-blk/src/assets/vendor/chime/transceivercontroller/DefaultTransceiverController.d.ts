import Logger from '../logger/Logger';
import VideoStreamIdSet from '../videostreamidset/VideoStreamIdSet';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import TransceiverController from './TransceiverController';
export default class DefaultTransceiverController implements TransceiverController {
    private logger;
    private localCameraTransceiver;
    private localAudioTransceiver;
    private videoSubscriptions;
    private defaultMediaStream;
    private peer;
    private browserBehavior;
    constructor(logger: Logger);
    static setVideoSendingBitrateKbpsForSender(sender: RTCRtpSender, bitrateKbps: number, logger: Logger): void;
    setVideoSendingBitrateKbps(bitrateKbps: number): void;
    setPeer(peer: RTCPeerConnection): void;
    reset(): void;
    useTransceivers(): boolean;
    trackIsVideoInput(track: MediaStreamTrack): boolean;
    setupLocalTransceivers(): void;
    setAudioInput(track: MediaStreamTrack | null): void;
    setVideoInput(track: MediaStreamTrack | null): void;
    updateVideoTransceivers(videoStreamIndex: VideoStreamIndex, videosToReceive: VideoStreamIdSet): number[];
    private unsubscribeTransceivers;
    private subscribeTransceivers;
    private transceiverIsVideo;
    private debugDumpTransceivers;
    private setTransceiverInput;
}
