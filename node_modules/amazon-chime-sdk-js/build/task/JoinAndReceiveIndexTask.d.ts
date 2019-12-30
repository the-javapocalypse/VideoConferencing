import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import BaseTask from './BaseTask';
export default class JoinAndReceiveIndexTask extends BaseTask {
    private context;
    protected taskName: string;
    private taskCanceler;
    private maxVideos;
    private sendBitrates;
    constructor(context: AudioVideoControllerState);
    cancel(): void;
    run(): Promise<void>;
}
