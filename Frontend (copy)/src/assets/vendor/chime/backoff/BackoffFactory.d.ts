import Backoff from './Backoff';
export default interface BackoffFactory {
    /**
     * Backoff factory method
     * @returns {Backoff}
     */
    create(): Backoff;
}
