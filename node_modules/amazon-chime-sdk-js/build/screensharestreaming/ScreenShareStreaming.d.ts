export default interface ScreenShareStreaming extends EventTarget {
    /**
     * Start the stream
     * @param {number} timeSliceMs
     * @returns {Promise<void>}
     */
    start(timeSliceMs?: number): void;
    /**
     * Stop the stream
     * @returns {Promise<void>}
     */
    stop(): Promise<void>;
}
