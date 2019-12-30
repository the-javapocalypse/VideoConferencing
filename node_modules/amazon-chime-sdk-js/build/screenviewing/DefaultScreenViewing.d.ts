import ScreenViewingComponentContext from './context/ScreenViewingComponentContext';
import ScreenObserver from './observer/ScreenObserver';
import ScreenViewing from './ScreenViewing';
import ScreenViewingSessionConnectionRequest from './session/ScreenViewingSessionConnectionRequest';
export default class DefaultScreenViewing implements ScreenViewing {
    private componentContext;
    constructor(componentContext: ScreenViewingComponentContext);
    open(request: ScreenViewingSessionConnectionRequest): Promise<void>;
    close(): Promise<void>;
    start(canvasContainer: HTMLDivElement): void;
    stop(): void;
    presentScaleToFit(): void;
    presentDragAndZoom(): void;
    zoomIn(relativeZoomFactor?: number): void;
    zoomOut(relativeZoomFactor?: number): void;
    zoom(absoluteZoomFactor: number): void;
    zoomReset(): void;
    registerObserver(observer: ScreenObserver): void;
    unregisterObserver(observer: ScreenObserver): void;
}
