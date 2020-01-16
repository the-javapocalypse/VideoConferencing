import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import RemovableObserver from '../removableobserver/RemovableObserver';
import BaseTask from './BaseTask';
export default class CreatePeerConnectionTask extends BaseTask implements RemovableObserver {
    private context;
    protected taskName: string;
    private removeTrackAddedEventListener;
    private removeTrackRemovedEventListeners;
    private readonly trackEvents;
    private removeVideoTrackEventListeners;
    constructor(context: AudioVideoControllerState);
    removeObserver(): void;
    run(): Promise<void>;
    private trackAddedHandler;
    private trackIsVideoInput;
    private addRemoteVideoTrack;
    private removeRemoteVideoTrack;
}
