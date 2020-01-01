export default interface PromisedWebSocket extends EventTarget {
    /**
     * Opens the connection
     * @param {number} timeoutMs
     * @returns {Promise<Event>}
     */
    open(timeoutMs: number): Promise<Event>;
    /**
     * Closes the connection
     * @param {number} timeoutMs
     * @returns {Promise<Event>}
     */
    close(timeoutMs: number, code?: number, reason?: string): Promise<Event>;
    /**
     * Sends the provided data
     * @param {string | ArrayBufferLike | Blob | ArrayBufferView} data
     * @returns {Promise<void>}
     */
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
}
