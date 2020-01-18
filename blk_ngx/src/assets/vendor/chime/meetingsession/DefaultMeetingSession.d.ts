import AudioVideoFacade from '../audiovideofacade/AudioVideoFacade';
import DeviceController from '../devicecontroller/DeviceController';
import Logger from '../logger/Logger';
import DeviceControllerBasedMediaStreamBroker from '../mediastreambroker/DeviceControllerBasedMediaStreamBroker';
import ScreenShareFacade from '../screensharefacade/ScreenShareFacade';
import ScreenShareViewFacade from '../screenshareviewfacade/ScreenShareViewFacade';
import MeetingSession from './MeetingSession';
import MeetingSessionConfiguration from './MeetingSessionConfiguration';
export default class DefaultMeetingSession implements MeetingSession {
    private _configuration;
    private _logger;
    private audioVideoController;
    private _deviceController;
    private screenShareFacade;
    private screenShareViewFacade;
    private static RECONNECT_TIMEOUT_MS;
    private static RECONNECT_FIXED_WAIT_MS;
    private static RECONNECT_SHORT_BACKOFF_MS;
    private static RECONNECT_LONG_BACKOFF_MS;
    constructor(configuration: MeetingSessionConfiguration, logger: Logger, deviceController: DeviceControllerBasedMediaStreamBroker);
    get configuration(): MeetingSessionConfiguration;
    get logger(): Logger;
    get audioVideo(): AudioVideoFacade;
    get screenShare(): ScreenShareFacade;
    get screenShareView(): ScreenShareViewFacade;
    get deviceController(): DeviceController;
    private checkBrowserSupport;
}
