export default interface MediaRecording extends EventTarget {
    /**
     * Start the media recorder instance
     * @param {number} timeSliceMs
     */
    start(timeSliceMs?: number): void;
    /**
     * Stop the media recorder instance
     */
    stop(): Promise<void>;
}
