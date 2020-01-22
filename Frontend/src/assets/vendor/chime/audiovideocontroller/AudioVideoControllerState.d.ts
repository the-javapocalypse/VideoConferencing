import AudioMixController from '../audiomixcontroller/AudioMixController';
import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import BrowserBehavior from '../browserbehavior/BrowserBehavior';
import ConnectionMonitor from '../connectionmonitor/ConnectionMonitor';
import DeviceController from '../devicecontroller/DeviceController';
import Logger from '../logger/Logger';
import MediaStreamBroker from '../mediastreambroker/MediaStreamBroker';
import MeetingSessionConfiguration from '../meetingsession/MeetingSessionConfiguration';
import MeetingSessionTURNCredentials from '../meetingsession/MeetingSessionTURNCredentials';
import MeetingSessionVideoAvailability from '../meetingsession/MeetingSessionVideoAvailability';
import RealtimeController from '../realtimecontroller/RealtimeController';
import ReconnectController from '../reconnectcontroller/ReconnectController';
import RemovableObserver from '../removableobserver/RemovableObserver';
import ScreenSharingSession from '../screensharingsession/ScreenSharingSession';
import SignalingClient from '../signalingclient/SignalingClient';
import { SdkIndexFrame, SdkStreamServiceType } from '../signalingprotocol/SignalingProtocol.js';
import StatsCollector from '../statscollector/StatsCollector';
import TransceiverController from '../transceivercontroller/TransceiverController';
import VideoDownlinkBandwidthPolicy from '../videodownlinkbandwidthpolicy/VideoDownlinkBandwidthPolicy';
import VideoStreamIdSet from '../videostreamidset/VideoStreamIdSet';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import VideoTileController from '../videotilecontroller/VideoTileController';
import VideoCaptureAndEncodeParameters from '../videouplinkbandwidthpolicy/VideoCaptureAndEncodeParameters';
import VideoUplinkBandwidthPolicy from '../videouplinkbandwidthpolicy/VideoUplinkBandwidthPolicy';
import VolumeIndicatorAdapter from '../volumeindicatoradapter/VolumeIndicatorAdapter';
/**
 * [[AudioVideoControllerState]] includes the compute resources shared by [[Task]].
 */
export default class AudioVideoControllerState {
    logger: Logger | null;
    browserBehavior: BrowserBehavior | null;
    signalingClient: SignalingClient | null;
    meetingSessionConfiguration: MeetingSessionConfiguration | null;
    peer: RTCPeerConnection | null;
    sdpOfferInit: RTCSessionDescriptionInit | null;
    audioVideoController: AudioVideoController | null;
    realtimeController: RealtimeController | null;
    videoTileController: VideoTileController | null;
    mediaStreamBroker: MediaStreamBroker | null;
    deviceController: DeviceController | null;
    audioMixController: AudioMixController | null;
    activeAudioInput: MediaStream | null;
    activeVideoInput: MediaStream | null;
    transceiverController: TransceiverController | null;
    indexFrame: SdkIndexFrame | null;
    iceCandidates: RTCIceCandidate[];
    iceCandidateHandler: (event: RTCPeerConnectionIceEvent) => void | null;
    screenSharingSession: ScreenSharingSession | null;
    sdpAnswer: string | null;
    turnCredentials: MeetingSessionTURNCredentials | null;
    reconnectController: ReconnectController | null;
    removableObservers: RemovableObserver[];
    videoStreamIndex: VideoStreamIndex | null;
    videoDownlinkBandwidthPolicy: VideoDownlinkBandwidthPolicy | null;
    videoUplinkBandwidthPolicy: VideoUplinkBandwidthPolicy | null;
    lastKnownVideoAvailability: MeetingSessionVideoAvailability | null;
    localVideoSender: RTCRtpSender | null;
    videoCaptureAndEncodeParameters: VideoCaptureAndEncodeParameters | null;
    videosToReceive: VideoStreamIdSet | null;
    videoSubscriptions: number[] | null;
    videosPaused: VideoStreamIdSet | null;
    videoDuplexMode: SdkStreamServiceType | null;
    volumeIndicatorAdapter: VolumeIndicatorAdapter | null;
    statsCollector: StatsCollector | null;
    connectionMonitor: ConnectionMonitor | null;
    videoInputAttachedTimestampMs: number;
    audioDeviceInformation: {
        [id: string]: string;
    };
    videoDeviceInformation: {
        [id: string]: string;
    };
}
