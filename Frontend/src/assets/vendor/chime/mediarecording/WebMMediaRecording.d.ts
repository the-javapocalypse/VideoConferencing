import MediaRecording from './MediaRecording';
import MediaRecordingOptions from './MediaRecordingOptions';
export default class WebMMediaRecording implements MediaRecording {
    private static options;
    private delegate;
    constructor(mediaStream: MediaStream, options?: MediaRecordingOptions);
    start(timeSliceMs?: number): void;
    stop(): Promise<void>;
    addEventListener(type: string, listener: EventListener): void;
    dispatchEvent(event: Event): boolean;
    removeEventListener(type: string, listener?: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
}
