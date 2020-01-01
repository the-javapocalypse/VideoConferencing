import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class CreateSDPTask extends BaseTask {
    private context;
    protected taskName: string;
    constructor(context: AudioVideoControllerState);
    sessionUsesAudio(): boolean;
    sessionUsesVideo(): boolean;
    run(): Promise<void>;
}
