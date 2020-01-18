import SDP from './SDP';
import SDPCandidateType from './SDPCandidateType';
/**
 * Implements [[SDP]]. [[SDP]] also includes a few helper functions for parsing string.
 */
export default class DefaultSDP implements SDP {
    sdp: string;
    private static CRLF;
    constructor(sdp: string);
    clone(): DefaultSDP;
    static isRTPCandidate(candidate: string): boolean;
    static linesToSDP(lines: string[]): DefaultSDP;
    static matchPrefix(blob: string, prefix: string): string[];
    static candidateTypeFromString(candidateType: string): SDPCandidateType | null;
    static candidateType(sdpLine: string): string | null;
    static splitLines(blob: string): string[];
    static splitSections(sdp: string): string[];
    static extractSSRCsFromFIDGroupLine(figGroupLine: string): string;
    static extractSSRCFromAttributeLine(ssrcMediaAttributeLine: string): number;
    static parseSSRCMedia(ssrcMediaAttributeLine: string): [number, string, string];
    static findActiveCameraSection(sections: string[]): number;
    lines(): string[];
    hasVideo(): boolean;
    hasCandidates(): boolean;
    hasCandidatesForAllMLines(): boolean;
    withBundleAudioVideo(): DefaultSDP;
    copyVideo(otherSDP: string): DefaultSDP;
    withoutCandidateType(candidateTypeToExclude: SDPCandidateType): DefaultSDP;
    withoutServerReflexiveCandidates(): DefaultSDP;
    withBandwidthRestriction(maxBitrateKbps: number, isUnifiedPlan: boolean): DefaultSDP;
    withPlanBSimulcast(videoSimulcastLayerCount: number): DefaultSDP;
    withUnifiedPlanFormat(): DefaultSDP;
}
