export default class DefaultBrowserBehavior {
    private readonly browser;
    version(): string;
    majorVersion(): number;
    isEdgeChromium(): boolean;
    isSafari(): boolean;
    isChrome(): boolean;
    isFirefox(): boolean;
    name(): string;
    requiresUnifiedPlan(): boolean;
    requiresIceCandidateCompletionBypass(): boolean;
    requiresIceCandidateGatheringTimeoutWorkaround(): boolean;
    requiresUnifiedPlanMunging(): boolean;
    requiresPromiseBasedWebRTCGetStats(): boolean;
    isSupported(): boolean;
    supportString(): string;
}
