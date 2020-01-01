/**
 * Instances of [[ScreenViewingSessionObserver]] can be registered with a
 * [[ScreenViewingSession]] to receive notifications of events.
 */
export default interface ScreenViewingSessionObserver {
    /**
     * Notifies when the WebSocket is closed.
     * @param event
     */
    didCloseWebSocket(event: CloseEvent): void;
    /**
     * Notifies when the WebSocket has received a message.
     * @param event
     */
    didReceiveWebSocketMessage(event: MessageEvent): void;
}
