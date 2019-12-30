import ScreenSharingSessionOptions from '../screensharingsession/ScreenSharingSessionOptions';
import MeetingSessionCredentials from './MeetingSessionCredentials';
import MeetingSessionURLs from './MeetingSessionURLs';
/**
 * [[MeetingSessionConfiguration]] contains the information necessary to start
 * a session.
 */
export default class MeetingSessionConfiguration {
    /**
     * The id of the meeting the session is joining
     */
    meetingId: string | null;
    /**
     * The credentials used to authenticate the session
     */
    credentials: MeetingSessionCredentials | null;
    /**
     * The URLs the session uses to reach the meeting service
     */
    urls: MeetingSessionURLs | null;
    /**
     * Maximum amount of time in milliseconds to allow for connecting.
     */
    connectionTimeoutMs: number;
    /**
     * Maximum amount of time in milliseconds to allow for a screen sharing connection.
     */
    screenSharingTimeoutMs: number;
    /**
     * Maximum amount of time in milliseconds to allow for a screen viewing connection.
     */
    screenViewingTimeoutMs: number;
    /**
     * Screen sharing session options
     */
    screenSharingSessionOptions: ScreenSharingSessionOptions;
    /**
     * Constructs a MeetingSessionConfiguration optionally with a chime:CreateMeeting and
     * chime:CreateAttendee response. You can pass in either a JSON object containing the
     * responses, or a JSON object containing the information in the Meeting and Attendee
     * root-level fields. Examples:
     *
     * ```
     * const configuration = new MeetingSessionConfiguration({
     *   "Meeting": {
     *      "MeetingId": "...",
     *      "MediaPlacement": {
     *        "AudioHostUrl": "...",
     *        "ScreenDataUrl": "...",
     *        "ScreenSharingUrl": "...",
     *        "ScreenViewingUrl": "...",
     *        "SignalingUrl": "...",
     *        "TurnControlUrl": "..."
     *      }
     *    }
     *   }
     * }, {
     *   "Attendee": {
     *     "ExternalUserId": "...",
     *     "AttendeeId": "...",
     *     "JoinToken": "..."
     *   }
     * });
     * ```
     *
     * ```
     * const configuration = new MeetingSessionConfiguration({
     *   "MeetingId": "...",
     *   "MediaPlacement": {
     *     "AudioHostUrl": "...",
     *     "ScreenDataUrl": "...",
     *     "ScreenSharingUrl": "...",
     *     "ScreenViewingUrl": "...",
     *     "SignalingUrl": "...",
     *     "TurnControlUrl": "..."
     *   }
     * }, {
     *   "ExternalUserId": "...",
     *   "AttendeeId": "...",
     *   "JoinToken": "..."
     * });
     * ```
     */
    constructor(createMeetingResponse?: any, createAttendeeResponse?: any);
}
