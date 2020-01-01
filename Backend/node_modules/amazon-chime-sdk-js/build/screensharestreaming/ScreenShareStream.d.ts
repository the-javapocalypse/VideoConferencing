import MediaRecording from '../mediarecording/MediaRecording';
import ScreenShareStreaming from './ScreenShareStreaming';
export default class ScreenShareStream implements ScreenShareStreaming {
    private mediaRecording;
    private listeners;
    constructor(mediaRecording: MediaRecording);
    start(timeSliceMs?: number): void;
    stop(): Promise<void>;
    addEventListener(type: string, listener: EventListener): void;
    dispatchEvent(event: Event): boolean;
    removeEventListener(type: string, listener: EventListener): void;
    private onDataAvailable;
    private newMessageEvent;
}
