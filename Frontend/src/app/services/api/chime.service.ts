import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService} from '../storage/local-storage.service';

import {environment} from '../../../environments/environment';

import {
    AsyncScheduler,
    AudioVideoFacade,
    AudioVideoObserver,
    ClientMetricReport,
    ConsoleLogger,
    DefaultActiveSpeakerPolicy,
    DefaultAudioMixController,
    DefaultDeviceController,
    DefaultMeetingSession,
    Device,
    DeviceChangeObserver,
    LogLevel,
    MeetingSession,
    MeetingSessionConfiguration,
    MeetingSessionStatus,
    MeetingSessionStatusCode,
    MeetingSessionVideoAvailability,
    ScreenMessageDetail,
    TimeoutScheduler,
    VideoTileState,
    ScreenShareFacadeObserver
} from '../../../assets/vendor/chimeCompiled/index';


@Injectable({
    providedIn: 'root'
})

// class DemoTileOrganizer {
//     private static MAX_TILES = 16;
//     private tiles: { [id: number]: number } = {};
//
//     acquireTileIndex(tileId: number): number {
//         for (let index = 0; index < DemoTileOrganizer.MAX_TILES; index++) {
//             if (this.tiles[index] === tileId) {
//                 return index;
//             }
//         }
//         for (let index = 0; index < DemoTileOrganizer.MAX_TILES; index++) {
//             if (!(index in this.tiles)) {
//                 this.tiles[index] = tileId;
//                 return index;
//             }
//         }
//         throw new Error('no tiles are available');
//     }
//
//     releaseTileIndex(tileId: number): number {
//         for (let index = 0; index < DemoTileOrganizer.MAX_TILES; index++) {
//             if (this.tiles[index] === tileId) {
//                 delete this.tiles[index];
//                 return index;
//             }
//         }
//         return DemoTileOrganizer.MAX_TILES;
//     }
// }
//
// class TestSound {
//     constructor(
//         sinkId: string | null,
//         frequency: number = 440,
//         durationSec: number = 1,
//         rampSec: number = 0.1,
//         maxGainValue: number = 0.1
//     ) {
//         // @ts-ignore
//         const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext)();
//         const gainNode = audioContext.createGain();
//         gainNode.gain.value = 0;
//         const oscillatorNode = audioContext.createOscillator();
//         oscillatorNode.frequency.value = frequency;
//         oscillatorNode.connect(gainNode);
//         const destinationStream = audioContext.createMediaStreamDestination();
//         gainNode.connect(destinationStream);
//         const currentTime = audioContext.currentTime;
//         const startTime = currentTime + 0.1;
//         gainNode.gain.linearRampToValueAtTime(0, startTime);
//         gainNode.gain.linearRampToValueAtTime(maxGainValue, startTime + rampSec);
//         gainNode.gain.linearRampToValueAtTime(maxGainValue, startTime + rampSec + durationSec);
//         gainNode.gain.linearRampToValueAtTime(0, startTime + rampSec * 2 + durationSec);
//         oscillatorNode.start();
//         const audioMixController = new DefaultAudioMixController();
//         // @ts-ignore
//         audioMixController.bindAudioDevice({deviceId: sinkId});
//         audioMixController.bindAudioElement(new Audio());
//         audioMixController.bindAudioStream(destinationStream.stream);
//         new TimeoutScheduler((rampSec * 2 + durationSec + 1) * 1000).start(() => {
//             audioContext.close();
//         });
//     }
// }


// @ts-ignore
export class ChimeService implements AudioVideoObserver, DeviceChangeObserver {

    static readonly DID: string = '+17035550122';
    static readonly BASE_URL: string = [location.protocol, '//', location.host, location.pathname.replace(/\/*$/, '/')].join('');

    // Todo: Export in other file
    private host = environment.server; // 'https://backend.syscon.io/' 'https://192.168.100.131:8080/'
    private apiUrl = this.host + 'vc/';

    // Store meeting id instead of reading from local storage everytime
    meetingId = null;

    // custom vars to sync info
    uploadBandwidth = 0;
    downloadBandwidth = 0;

    showActiveSpeakerScores = false;
    // activeSpeakerLayout = true;
    // meeting: string | null = null;
    // name: string | null = null;
    // voiceConnectorId: string | null = null;
    // sipURI: string | null = null;
    // region: string | null = null;
    //
    meetingSession: MeetingSession | null = null;
    audioVideo: AudioVideoFacade | null = null;
    // // tileOrganizer: DemoTileOrganizer = new DemoTileOrganizer();
    // canStartLocalVideo = true;
    // // eslint-disable-next-line
    roster: any = {};
    // tileIndexToTileId: { [id: number]: number } = {};
    // tileIdToTileIndex: { [id: number]: number } = {};
    //
    // buttonStates: { [key: string]: boolean } = {
    //     'button-microphone': true,
    //     'button-camera': false,
    //     'button-speaker': true,
    //     'button-screen-share': false,
    //     'button-screen-view': false,
    // };
    //
    private selectedVideoInput: string | null = null;
    //
    // // feature flags
    enableWebAudio = false;

    constructor(private http: HttpClient, private storage: LocalStorageService) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // (global as any).app = this;
        // this.switchToFlow('flow-authenticate');
        // this.initEventListeners();
        // this.initParameters();
    }

    // initParameters(): void {
    //     const meeting = new URL(window.location.href).searchParams.get('m');
    //     if (meeting) {
    //         (document.getElementById('inputMeeting') as HTMLInputElement).value = meeting;
    //         (document.getElementById('inputName') as HTMLInputElement).focus();
    //     } else {
    //         (document.getElementById('inputMeeting') as HTMLInputElement).focus();
    //     }
    // }

    // All event listeners for buttons'
    // We need to convert each listener to a method
    initEventListeners(): void {
        // window.addEventListener('resize', () => {
        //     this.layoutVideoTiles();
        // });

        // Authenticate form event handler
        // document.getElementById('form-authenticate').addEventListener('submit', e => {
        //     e.preventDefault();
        //     this.meeting = (document.getElementById('inputMeeting') as HTMLInputElement).value;
        //     this.name = (document.getElementById('inputName') as HTMLInputElement).value;
        //     this.region = (document.getElementById('inputRegion') as HTMLInputElement).value;
        //     new AsyncScheduler().start(
        //         async (): Promise<void> => {
        //             this.showProgress('progress-authenticate');
        //             try {
        //                 await this.authenticate();
        //             } catch (error) {
        //                 (document.getElementById(
        //                     'failed-meeting'
        //                 ) as HTMLDivElement).innerHTML = `Meeting ID: ${this.meeting}`;
        //                 (document.getElementById('failed-meeting-error') as HTMLDivElement).innerHTML =
        //                     error.message;On submitting form with name, meeting id and region
        //                 this.switchToFlow('flow-failed-meeting');
        //                 return;
        //             }
        //             (document.getElementById(
        //                 'meeting-id'
        //             ) as HTMLSpanElement).innerHTML = `${this.meeting} (${this.region})`;
        //             (document.getElementById('info-meeting') as HTMLSpanElement).innerHTML = this.meeting;
        //             (document.getElementById('info-name') as HTMLSpanElement).innerHTML = this.name;
        //             this.switchToFlow('flow-devices');
        //             await this.openAudioInputFromSelection();
        //             try {
        //                 await this.openVideoInputFromSelection(
        //                     (document.getElementById('video-input') as HTMLSelectElement).value,
        //                     true
        //                 );
        //             } catch (err) {
        //                 this.log('no video input device selected');
        //             }
        //             await this.openAudioOutputFromSelection();
        //             this.hideProgress('progress-authenticate');
        //         }
        //     );
        // });


        // Goto SIP flow
        // document.getElementById('to-sip-flow').addEventListener('click', e => {
        //     e.preventDefault();
        //     this.switchToFlow('flow-sip-authenticate');
        // });


        // Sip Authentication
        // document.getElementById('form-sip-authenticate').addEventListener('submit', e => {
        //     e.preventDefault();
        //     this.meeting = (document.getElementById('sip-inputMeeting') as HTMLInputElement).value;
        //     this.voiceConnectorId = (document.getElementById(
        //         'voiceConnectorId'
        //     ) as HTMLInputElement).value;
        //
        //     new AsyncScheduler().start(
        //         async (): Promise<void> => {
        //             this.showProgress('progress-authenticate');
        //             try {
        //                 const response = await fetch(
        // tslint:disable-next-line:max-line-length
        //                     `${DemoMeetingApp.BASE_URL}join?title=${encodeURIComponent(this.meeting)}&name=${encodeURIComponent(DemoMeetingApp.DID)}&region=${encodeURIComponent(this.region)}`,
        //                     {
        //                         method: 'POST',
        //                     }
        //                 );
        //                 const json = await response.json();
        //                 const joinToken = json.JoinInfo.Attendee.JoinToken;
        //                 this.sipURI = `sip:${DemoMeetingApp.DID}@${this.voiceConnectorId};transport=tls;X-joinToken=${joinToken}`;
        //                 this.switchToFlow('flow-sip-uri');
        //             } catch (error) {
        //                 (document.getElementById(
        //                     'failed-meeting'
        //                 ) as HTMLDivElement).innerHTML = `Meeting ID: ${this.meeting}`;
        //                 (document.getElementById('failed-meeting-error') as HTMLDivElement).innerHTML =
        //                     error.message;
        //                 this.switchToFlow('flow-failed-meeting');
        //                 return;
        //             }
        //             const sipUriElement = document.getElementById('sip-uri') as HTMLInputElement;
        //             sipUriElement.value = this.sipURI;
        //             this.hideProgress('progress-authenticate');
        //         }
        //     );
        // });

        // Copy Sip uri
        // document.getElementById('copy-sip-uri').addEventListener('click', () => {
        //     const sipUriElement = document.getElementById('sip-uri') as HTMLInputElement;
        //     sipUriElement.select();
        //     document.execCommand('copy');
        // });

        // Change audio input device
        // const audioInput = document.getElementById('audio-input') as HTMLSelectElement;
        // audioInput.addEventListener('change', async (_ev: Event) => {
        //     this.log('audio input device is changed');
        //     await this.openAudioInputFromSelection();
        // });

        // Change video input device
        // const videoInput = document.getElementById('video-input') as HTMLSelectElement;
        // videoInput.addEventListener('change', async (_ev: Event) => {
        //     this.log('video input device is changed');
        //     try {
        //         await this.openVideoInputFromSelection(videoInput.value, true);
        //     } catch (err) {
        //         this.log('no video input device selected');
        //     }
        // });

        // Select video quality
        // const videoInputQuality = document.getElementById('video-input-quality') as HTMLSelectElement;
        // videoInputQuality.addEventListener('change', async (_ev: Event) => {
        //     this.log('Video input quality is changed');
        //     switch (videoInputQuality.value) {
        //         case '360p':
        //             this.audioVideo.chooseVideoInputQuality(640, 360, 15, 600);
        //             break;
        //         case '540p':
        //             this.audioVideo.chooseVideoInputQuality(960, 540, 15, 1400);
        //             break;
        //         case '720p':
        //             this.audioVideo.chooseVideoInputQuality(1280, 720, 15, 1400);
        //             break;
        //     }
        //     try {
        //         await this.openVideoInputFromSelection(videoInput.value, true);
        //     } catch (err) {
        //         this.log('no video input device selected');
        //     }
        // });

        // Change audio output device
        // const audioOutput = document.getElementById('audio-output') as HTMLSelectElement;
        // audioOutput.addEventListener('change', async (_ev: Event) => {
        //     this.log('audio output device is changed');
        //     await this.openAudioOutputFromSelection();
        // });

        // Sound test button
        // document.getElementById('button-test-sound').addEventListener('click', e => {
        //     e.preventDefault();
        //     const audioOutput = document.getElementById('audio-output') as HTMLSelectElement;
        //     new TestSound(audioOutput.value);
        // });

        // Form Devices
        // document.getElementById('form-devices').addEventListener('submit', e => {
        //     e.preventDefault();
        //     new AsyncScheduler().start(async () => {
        //         try {
        //             this.showProgress('progress-join');
        //             await this.join();
        //             this.audioVideo.stopVideoPreviewForVideoInput(document.getElementById(
        //                 'video-preview'
        //             ) as HTMLVideoElement);
        //             this.audioVideo.chooseVideoInputDevice(null);
        //             this.hideProgress('progress-join');
        //             this.displayButtonStates();
        //             this.switchToFlow('flow-meeting');
        //         } catch (error) {
        //             document.getElementById('failed-join').innerHTML = `Meeting ID: ${this.meeting}`;
        //             document.getElementById('failed-join-error').innerHTML = `Error: ${error.message}`;
        //         }
        //     });
        // });

        // Microphone Button
        // const buttonMute = document.getElementById('button-microphone');
        // buttonMute.addEventListener('mousedown', _e => {
        //     if (this.toggleButton('button-microphone')) {
        //         this.audioVideo.realtimeUnmuteLocalAudio();
        //     } else {
        //         this.audioVideo.realtimeMuteLocalAudio();
        //     }
        // });

        // Camera Button
        // const buttonVideo = document.getElementById('button-camera');
        // buttonVideo.addEventListener('click', _e => {
        //     new AsyncScheduler().start(async () => {
        //         if (this.toggleButton('button-camera') && this.canStartLocalVideo) {
        //             try {
        //                 await this.openVideoInputFromSelection(null, false);
        //                 this.audioVideo.startLocalVideoTile();
        //             } catch (err) {
        //                 this.log('no video input device selected');
        //             }
        //         } else {
        //             this.audioVideo.stopLocalVideoTile();
        //             this.hideTile(16);
        //         }
        //     });
        // });

        // Screen share button
        // const buttonScreenShare = document.getElementById('button-screen-share');
        // buttonScreenShare.addEventListener('click', () => {
        //     new AsyncScheduler().start(async () => {
        //         const button = 'button-screen-share';
        //         if (this.buttonStates[button]) {
        //             this.meetingSession.screenShare.stop().then(() => {
        //                 this.buttonStates[button] = false;
        //                 this.displayButtonStates();
        //             });
        //         } else {
        //             const self = this;
        //             const observer: ScreenShareFacadeObserver = {
        //                 didStopScreenSharing(): void {
        //                     self.buttonStates[button] = false;
        //                     self.displayButtonStates();
        //                 },
        //             };
        //             this.meetingSession.screenShare.registerObserver(observer);
        //             this.meetingSession.screenShare.start().then(() => {
        //                 this.buttonStates[button] = true;
        //                 this.displayButtonStates();
        //             });
        //         }
        //     });
        // });

        // Speaker button
        // const buttonSpeaker = document.getElementById('button-speaker');
        // buttonSpeaker.addEventListener('click', _e => {
        //     new AsyncScheduler().start(async () => {
        //         if (this.toggleButton('button-speaker')) {
        //             this.audioVideo.bindAudioElement(document.getElementById(
        //                 'meeting-audio'
        //             ) as HTMLAudioElement);
        //         } else {
        //             this.audioVideo.unbindAudioElement();
        //         }
        //     });
        // });

        // Screen View Button
        // const buttonScreenView = document.getElementById('button-screen-view');
        // buttonScreenView.addEventListener('click', _e => {
        //     new AsyncScheduler().start(async () => {
        //         if (this.toggleButton('button-screen-view')) {
        //             const screenViewDiv = document.getElementById('tile-17') as HTMLDivElement;
        //             screenViewDiv.style.display = 'block';
        //             this.meetingSession.screenShareView.start(screenViewDiv);
        //         } else {
        //             this.meetingSession.screenShareView.stop();
        //             this.hideTile(17);
        //         }
        //         this.layoutVideoTiles();
        //     });
        // });

        // Meeting ending button
        // const buttonMeetingEnd = document.getElementById('button-meeting-end');
        // buttonMeetingEnd.addEventListener('click', _e => {
        //     const confirmEnd = (new URL(window.location.href).searchParams.get('confirm-end')) === 'true';
        //     const prompt = 'Are you sure you want to end the meeting for everyone? The meeting cannot be used after ending it.';
        //     if (confirmEnd && !window.confirm(prompt)) {
        //         return;
        //     }
        //     new AsyncScheduler().start(async () => {
        //         (buttonMeetingEnd as HTMLButtonElement).disabled = true;
        //         await this.endMeeting();
        //         this.leave();
        //         (buttonMeetingEnd as HTMLButtonElement).disabled = false;
        //         // @ts-ignore
        //         window.location = window.location.pathname;
        //     });
        // });

        // Meeting leave button
        // const buttonMeetingLeave = document.getElementById('button-meeting-leave');
        // buttonMeetingLeave.addEventListener('click', _e => {
        //     new AsyncScheduler().start(async () => {
        //         (buttonMeetingLeave as HTMLButtonElement).disabled = true;
        //         this.leave();
        //         (buttonMeetingLeave as HTMLButtonElement).disabled = false;
        //         // @ts-ignore
        //         window.location = window.location.pathname;
        //     });
        // });
    }

    // Toggle buttons
    // toggleButton(button: string, state?: 'on' | 'off'): boolean {
    //     if (state === 'on') {
    //         this.buttonStates[button] = true;
    //     } else if (state === 'off') {
    //         this.buttonStates[button] = false;
    //     } else {
    //         this.buttonStates[button] = !this.buttonStates[button];
    //     }
    //     this.displayButtonStates();
    //     return this.buttonStates[button];
    // }

    // Set button states based on toggle
    // displayButtonStates(): void {
    //     for (const button in this.buttonStates) {
    //         const element = document.getElementById(button);
    //         const drop = document.getElementById(`${button}-drop`);
    //         const on = this.buttonStates[button];
    //         element.classList.add(on ? 'btn-success' : 'btn-outline-secondary');
    //         element.classList.remove(on ? 'btn-outline-secondary' : 'btn-success');
    //         (element.firstElementChild as SVGElement).classList.add(on ? 'svg-active' : 'svg-inactive');
    //         (element.firstElementChild as SVGElement).classList.remove(
    //             on ? 'svg-inactive' : 'svg-active'
    //         );
    //         if (drop) {
    //             drop.classList.add(on ? 'btn-success' : 'btn-outline-secondary');
    //             drop.classList.remove(on ? 'btn-outline-secondary' : 'btn-success');
    //         }
    //     }
    // }

    // Show progress bar
    // showProgress(id: string): void {
    //     (document.getElementById(id) as HTMLDivElement).style.visibility = 'visible';
    // }

    // Hide progress bar
    // hideProgress(id: string): void {
    //     (document.getElementById(id) as HTMLDivElement).style.visibility = 'hidden';
    // }

    // Switch flow
    // switchToFlow(flow: string): void {
    //     this.analyserNodeCallback = () => {
    //     };
    //     Array.from(document.getElementsByClassName('flow')).map(
    //         e => ((e as HTMLDivElement).style.display = 'none')
    //     );
    //     (document.getElementById(flow) as HTMLDivElement).style.display = 'block';
    //     if (flow === 'flow-devices') {
    //         this.startAudioPreview();
    //     }
    // }

    // Audio input changed| audio input lists
    // audioInputsChanged(_freshAudioInputDeviceList: MediaDeviceInfo[]): void {
    //     this.populateAudioInputList();
    // }

    // Video input changed | video input lists
    // videoInputsChanged(_freshVideoInputDeviceList: MediaDeviceInfo[]): void {
    //     this.populateVideoInputList();
    // }

    // Audio output changed| audio output lists
    // audioOutputsChanged(_freshAudioOutputDeviceList: MediaDeviceInfo[]): void {
    //     this.populateAudioOutputList();
    // }

    // Bandwith and metrics available
    metricsDidReceive(clientMetricReport: ClientMetricReport): void {
        const metricReport = clientMetricReport.getObservableMetrics();
        const availableSendBandwidth = metricReport.availableSendBandwidth;
        const availableRecvBandwidth = metricReport.availableReceiveBandwidth;
        if (typeof availableSendBandwidth === 'number' && !isNaN(availableSendBandwidth)) {
            // (document.getElementById('video-uplink-bandwidth') as HTMLSpanElement).innerHTML =
            //     'Available Uplink Bandwidth: ' + String(availableSendBandwidth / 1000) + ' Kbps';
            this.uploadBandwidth = Math.floor(availableSendBandwidth / 1000);
        } else {
            // (document.getElementById('video-uplink-bandwidth') as HTMLSpanElement).innerHTML =
            //     'Available Uplink Bandwidth: Unknown';
            this.uploadBandwidth = 0;
        }
        if (typeof availableRecvBandwidth === 'number' && !isNaN(availableRecvBandwidth)) {
            // (document.getElementById('video-downlink-bandwidth') as HTMLSpanElement).innerHTML =
            //     'Available Downlink Bandwidth: ' + String(availableRecvBandwidth / 1000) + ' Kbps';
            this.downloadBandwidth = Math.floor(availableRecvBandwidth / 1000);
        } else {
            // (document.getElementById('video-downlink-bandwidth') as HTMLSpanElement).innerHTML =
            //     'Available Downlink Bandwidth: Unknown';
            this.downloadBandwidth = 0;
        }
    }


    // Set click handler
    // setClickHandler(elementId: string, f: () => void): void {
    //     document.getElementById(elementId).addEventListener('click', () => {
    //         f();
    //     });
    // }

    // Join meeting
    async join(): Promise<void> {
        this.audioVideo.start();
        await this.meetingSession.screenShare.open();
        await this.meetingSession.screenShareView.open();
    }

    // Leave meeting
    leave(): void {
        this.meetingSession.screenShare
            .stop()
            .catch(() => {
            })
            .finally(() => {
                return this.meetingSession.screenShare.close();
            });
        this.meetingSession.screenShareView.close();
        this.audioVideo.stop();
        this.roster = {};
    }


    // End meeting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // async endMeeting(): Promise<any> {
    //     await fetch(`${DemoMeetingApp.BASE_URL}end?title=${encodeURIComponent(this.meeting)}`, {
    //         method: 'POST',
    //     });
    // }


    // private analyserNodeCallback = () => {
    // };

    // async openAudioInputFromSelection(): Promise<void> {
    //     const audioInput = document.getElementById('audio-input') as HTMLSelectElement;
    //     await this.audioVideo.chooseAudioInputDevice(
    //         this.audioInputSelectionToDevice(audioInput.value)
    //     );
    //     this.startAudioPreview();
    // }

    // setAudioPreviewPercent(percent: number): void {
    //     const audioPreview = document.getElementById('audio-preview');
    //     if (audioPreview.getAttribute('aria-valuenow') !== `${percent}`) {
    //         audioPreview.style.width = `${percent}%`;
    //         audioPreview.setAttribute('aria-valuenow', `${percent}`);
    //     }
    //     const transitionDuration = '33ms';
    //     if (audioPreview.style.transitionDuration !== transitionDuration) {
    //         audioPreview.style.transitionDuration = transitionDuration;
    //     }
    // }


    // startAudioPreview(): void {
    //     this.setAudioPreviewPercent(0);
    //     const analyserNode = this.audioVideo.createAnalyserNodeForAudioInput();
    //     if (!analyserNode) {
    //         return;
    //     }
    //     if (!analyserNode.getFloatTimeDomainData) {
    //         document.getElementById('audio-preview').parentElement.style.visibility = 'hidden';
    //         return;
    //     }
    //     const data = new Float32Array(analyserNode.fftSize);
    //     let frameIndex = 0;
    //     this.analyserNodeCallback = () => {
    //         if (frameIndex === 0) {
    //             analyserNode.getFloatTimeDomainData(data);
    //             const lowest = 0.01;
    //             let max = lowest;
    //             for (const f of data) {
    //                 max = Math.max(max, Math.abs(f));
    //             }
    //             let normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
    //             let percent = Math.min(Math.max(normalized * 100, 0), 100);
    //             this.setAudioPreviewPercent(percent);
    //         }
    //         frameIndex = (frameIndex + 1) % 2;
    //         requestAnimationFrame(this.analyserNodeCallback);
    //     };
    //     requestAnimationFrame(this.analyserNodeCallback);
    // }

    // async openAudioOutputFromSelection(): Promise<void> {
    //     const audioOutput = document.getElementById('audio-output') as HTMLSelectElement;
    //     await this.audioVideo.chooseAudioOutputDevice(audioOutput.value);
    //     const audioMix = document.getElementById('meeting-audio') as HTMLAudioElement;
    //     await this.audioVideo.bindAudioElement(audioMix);
    // }


    // async authenticate(): Promise<void> {
    //     let joinInfo = (await this.joinMeeting()).JoinInfo;
    //     await this.initializeMeetingSession(
    //         new MeetingSessionConfiguration(joinInfo.Meeting, joinInfo.Attendee)
    //     );
    //     const url = new URL(window.location.href);
    //     url.searchParams.set('m', this.meeting);
    //     history.replaceState({}, `${this.meeting}`, url.toString());
    // }

    // Join meeting
    // eslint-disable-next-line
    // async joinMeeting(): Promise<any> {
    //     const response = await fetch(
    // tslint:disable-next-line:max-line-length
    //         `${DemoMeetingApp.BASE_URL}join?title=${encodeURIComponent(this.meeting)}&name=${encodeURIComponent(this.name)}&region=${encodeURIComponent(this.region)}`,
    //         {
    //             method: 'POST',
    //         }
    //     );
    //     const json = await response.json();
    //     if (json.error) {
    //         throw new Error(`Server error: ${json.error}`);
    //     }
    //     return json;
    // }

    // Setup device label trigger
    setupDeviceLabelTrigger(): void {
        // Note that device labels are privileged since they add to the
        // fingerprinting surface area of the browser session. In Chrome private
        // tabs and in all Firefox tabs, the labels can only be read once a
        // MediaStream is active. How to deal with this restriction depends on the
        // desired UX. The device controller includes an injectable device label
        // trigger which allows you to perform custom behavior in case there are no
        // labels, such as creating a temporary audio/video stream to unlock the
        // device names, which is the default behavior. Here we override the
        // trigger to also show an alert to let the user know that we are asking for
        // mic/camera permission.
        //
        // Also note that Firefox has its own device picker, which may be useful
        // for the first device selection. Subsequent device selections could use
        // a custom UX with a specific device id.
        this.audioVideo.setDeviceLabelTrigger(
            async (): Promise<MediaStream> => {
                const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
                return stream;
            }
        );
    }


    // Def: Initialize ConsoleLogger(),
    //      Initialize DefaultDeviceController(),
    //      set enableWebAudio flag,
    //      set addDeviceChangeObserver(),
    //      setupDeviceLabelTrigger() to get audio and video permissions,
    //      populateAllDeviceLists() initialize and get list of all audio and video devices ui
    //      setupMuteHandler() realtime mute unmute set
    //      canUnmuteHandler()  realtime mute unmute boolean check
    //      setupSubscribeToAttendeeIdPresenceHandler() update roaster for attendees info ui
    //      setupScreenViewing()    setup screen viewing ui
    //      audioVideo add observer
    // Params: res.joinInfo.Meeting and res.joinInfo.Attendee  subscribed to joinMeeting()
    // Return:
    async initializeMeetingSession(configuration: MeetingSessionConfiguration): Promise<void> {
        const logger = new ConsoleLogger('SDK', LogLevel.INFO);
        const deviceController = new DefaultDeviceController(logger);
        configuration.enableWebAudio = this.enableWebAudio;
        this.meetingSession = new DefaultMeetingSession(configuration, logger, deviceController);
        this.audioVideo = this.meetingSession.audioVideo;
        // @ts-ignore
        this.audioVideo.addDeviceChangeObserver(this);
        this.setupDeviceLabelTrigger();
        await this.populateAllDeviceLists();
        this.setupMuteHandler();
        this.setupCanUnmuteHandler();
        this.setupSubscribeToAttendeeIdPresenceHandler();
        this.setupScreenViewing();
        // @ts-ignore
        this.audioVideo.addObserver(this);
    }

    log(str: string): void {
        console.log(`[DEMO] ${str}`);
    }

    ////////////////////// Segment populate all device lists //////////////////////


    async populateAllDeviceLists(): Promise<void> {
        await this.populateAudioInputList();
        await this.populateVideoInputList();
        await this.populateAudioOutputList();
    }

    // -------------------- VIDEO INPUTS ----------------------- //

    // Def: Toggle camera off or choose from available camera devices and show preview
    async openVideoInputFromSelection(selection: string | null, showPreview: boolean): Promise<void> {
        if (selection) {
            this.selectedVideoInput = selection;
        }
        this.log(`Switching to: ${this.selectedVideoInput}`);
        const device = this.videoInputSelectionToDevice(this.selectedVideoInput);
        if (device === null) {
            this.audioVideo.stopLocalVideoTile();
            // !! toggle camera button off here
            // this.toggleButton('button-camera', 'off');
            throw new Error('no video device selected');
        }
        await this.audioVideo.chooseVideoInputDevice(device);
        if (showPreview) {
            // !! Show video preview here
            // this.audioVideo.startVideoPreviewForVideoInput(document.getElementById(
            //     'video-preview'
            // ) as HTMLVideoElement);
        }
    }

    private videoInputSelectionToDevice(value: string): Device {
        if (value === 'Blue') {
            return DefaultDeviceController.synthesizeVideoDevice('blue');
        } else if (value === 'SMPTE Color Bars') {
            return DefaultDeviceController.synthesizeVideoDevice('smpte');
        } else if (value === 'None') {
            return null;
        }
        return value;
    }


    async populateVideoInputList(): Promise<void> {
        const genericName = 'Camera';
        const additionalDevices = ['None', 'Blue', 'SMPTE Color Bars'];
        this.populateDeviceList(
            'video-input',
            genericName,
            await this.audioVideo.listVideoInputDevices(),
            additionalDevices
        );
        this.populateInMeetingDeviceList(
            'dropdown-menu-camera',
            genericName,
            await this.audioVideo.listVideoInputDevices(),
            additionalDevices,
            async (name: string) => {
                try {
                    await this.openVideoInputFromSelection(name, false);
                } catch (err) {
                    this.log('no video input device selected');
                }
            }
        );
    }

    // -------------------- AUDIO INPUTS ----------------------- //

    // Def:Choose from available audio devices
    private audioInputSelectionToDevice(value: string): Device {
        if (value === '440 Hz') {
            return DefaultDeviceController.synthesizeAudioDevice(440);
        } else if (value === 'None') {
            return null;
        }
        return value;
    }


    async populateAudioInputList(): Promise<void> {
        const genericName = 'Microphone';
        const additionalDevices = ['None', '440 Hz'];
        this.populateDeviceList(
            'audio-input',
            genericName,
            await this.audioVideo.listAudioInputDevices(),
            additionalDevices
        );
        this.populateInMeetingDeviceList(
            'dropdown-menu-microphone',
            genericName,
            await this.audioVideo.listAudioInputDevices(),
            additionalDevices,
            async (name: string) => {
                await this.audioVideo.chooseAudioInputDevice(this.audioInputSelectionToDevice(name));
            }
        );
    }

    // -------------------- AUDIO OUTPUTS ----------------------- //

    async populateAudioOutputList(): Promise<void> {
        // const genericName = 'Speaker';
        // const additionalDevices: string[] = [];
        // this.populateDeviceList(
        //     'audio-output',
        //     genericName,
        //     await this.audioVideo.listAudioOutputDevices(),
        //     additionalDevices
        // );
        // this.populateInMeetingDeviceList(
        //     'dropdown-menu-speaker',
        //     genericName,
        //     await this.audioVideo.listAudioOutputDevices(),
        //     additionalDevices,
        //     async (name: string) => {
        //         await this.audioVideo.chooseAudioOutputDevice(name);
        //     }
        // );
    }


    // ------------------- Set Frontend For Audio|Video Lists ---------------------- //


    // Def: Map available audio|video devices to frontend for pre-meeting
    populateDeviceList(
        elementId: string,
        genericName: string,
        devices: MediaDeviceInfo[],
        additionalOptions: string[]
    ): void {
        // const list = document.getElementById(elementId) as HTMLSelectElement;
        // while (list.firstElementChild) {
        //     list.removeChild(list.firstElementChild);
        // }
        // for (let i = 0; i < devices.length; i++) {
        // const option = document.createElement('option');
        // list.appendChild(option);
        // option.text = devices[i].label || `${genericName} ${i + 1}`;
        // option.value = devices[i].deviceId;
        // }
        // if (additionalOptions.length > 0) {
        //     const separator = document.createElement('option');
        //     separator.disabled = true;
        //     separator.text = '──────────';
        //     list.appendChild(separator);
        //     for (const additionalOption of additionalOptions) {
        //         const option = document.createElement('option');
        //         list.appendChild(option);
        //         option.text = additionalOption;
        //         option.value = additionalOption;
        //     }
        // }
        // if (!list.firstElementChild) {
        //     const option = document.createElement('option');
        //     option.text = 'Device selection u: Promise<any>navailable';
        //     list.appendChild(option);
        // }
    }

    // Def: Map available audio|video devices to frontend for meeting
    populateInMeetingDeviceList(
        elementId: string,
        genericName: string,
        devices: MediaDeviceInfo[],
        additionalOptions: string[],
        callback: (name: string) => void
    ): void {
        // const menu = document.getElementById(elementId) as HTMLDivElement;
        // while (menu.firstElementChild) {
        //     menu.removeChild(menu.firstElementChild);
        // }
        // for (let i = 0; i < devices.length; i++) {
        // this.createDropdownMenuItem(menu, devices[i].label || `${genericName} ${i + 1}`, () => {
        //     callback(devices[i].deviceId);
        // });
        // }
        // if (additionalOptions.length > 0) {
        //     this.createDropdownMenuItem(menu, '──────────', () => {
        //     }).classList.add('text-center');
        //     for (const additionalOption of additionalOptions) {
        //         this.createDropdownMenuItem(
        //             menu,
        //             additionalOption,
        //             () => {
        //                 callback(additionalOption);
        //             },
        //             `${elementId}-${additionalOption.replace(/\s/g, '-')}`
        //         );
        //     }
        // }
        // if (!menu.firstElementChild) {
        //     this.createDropdownMenuItem(menu, 'Device selection unavailable', () => {
        //     });
        // }
    }

    // Def: Create dropdown item list for available input|output audio and video sources
    // createDropdownMenuItem(
    //     menu: HTMLDivElement,
    //     title: string,
    //     clickHandler: () => void,
    //     id?: string
    // ): HTMLButtonElement {
    //     const button = document.createElement('button') as HTMLButtonElement;
    //     menu.appendChild(button);
    //     button.innerHTML = title;
    //     button.classList.add('dropdown-item');
    //     if (id !== undefined) {
    //         button.id = id;
    //     }
    //     button.addEventListener('click', () => {
    //         clickHandler();
    //     });
    //     return button;
    // }


    //////////////////////////////// MUTE|UNMUTE Handlers ////////////////////////////////////


    // Setup Mute handler
    setupMuteHandler(): void {
        // tslint:disable-next-line:no-shadowed-variable
        const handler = (isMuted: boolean): void => {
            this.log(`muted = ${isMuted}`);
        };
        this.audioVideo.realtimeSubscribeToMuteAndUnmuteLocalAudio(handler);
        const isMuted = this.audioVideo.realtimeIsLocalAudioMuted();
        handler(isMuted);
    }

    // Setup unmute handler
    setupCanUnmuteHandler(): void {
        const handler = (canUnmute: boolean): void => {
            this.log(`canUnmute = ${canUnmute}`);
        };
        this.audioVideo.realtimeSubscribeToSetCanUnmuteLocalAudio(handler);
        handler(this.audioVideo.realtimeCanUnmuteLocalAudio());
    }


    ////////////////////////////////// Attendee Presence /////////////////////////////////////////////

    // Attendee id presence handler
    setupSubscribeToAttendeeIdPresenceHandler(): void {
        const handler = (attendeeId: string, present: boolean): void => {
            this.log(`${attendeeId} present = ${present}`);
            if (!present) {
                delete this.roster[attendeeId];
                this.updateRoster();
                return;
            }
            this.audioVideo.realtimeSubscribeToVolumeIndicator(
                attendeeId,
                async (
                    // tslint:disable-next-line:no-shadowed-variable
                    attendeeId: string,
                    volume: number | null,
                    muted: boolean | null,
                    signalStrength: number | null
                ) => {
                    if (!this.roster[attendeeId]) {
                        this.roster[attendeeId] = {name: ''};
                    }
                    if (volume !== null) {
                        this.roster[attendeeId].volume = Math.round(volume * 100);
                    }
                    if (muted !== null) {
                        this.roster[attendeeId].muted = muted;
                    }
                    if (signalStrength !== null) {
                        this.roster[attendeeId].signalStrength = Math.round(signalStrength * 100);
                    }
                    if (!this.roster[attendeeId].name) {
                        // Get attendee info if not already present
                        // Todo: Dont read from local storage everytime, instead save it in a variable and read from local storage
                        // todo: if only the variable is empty
                        if (this.meetingId === null) {
                            this.meetingId = this.storage.getRoasterInfo().meetingId;
                        }
                        const response = await this.getAttendeeInfo({
                            title: this.meetingId,
                            attendee: attendeeId
                        }).subscribe((res: any) => {
                            const name = res.AttendeeInfo.Name;
                            this.roster[attendeeId].name = name ? name : '';
                            this.updateRoster();
                        });
                    }
                    this.updateRoster();
                }
            );
        };
        this.audioVideo.realtimeSubscribeToAttendeeIdPresence(handler);
        const activeSpeakerHandler = (attendeeIds: string[]): void => {
            // tslint:disable-next-line:forin
            for (const attendeeId in this.roster) {
                this.roster[attendeeId].active = false;
            }
            for (const attendeeId of attendeeIds) {
                if (this.roster[attendeeId]) {
                    this.roster[attendeeId].active = true;
                    break; // only show the most active speaker
                }
            }
            this.layoutVideoTiles();
        };
        this.audioVideo.subscribeToActiveSpeakerDetector(
            new DefaultActiveSpeakerPolicy(),
            activeSpeakerHandler,
            (scores: { [attendeeId: string]: number }) => {
                for (const attendeeId in scores) {
                    if (this.roster[attendeeId]) {
                        this.roster[attendeeId].score = scores[attendeeId];
                    }
                }
                this.updateRoster();
            },
            this.showActiveSpeakerScores ? 100 : 0,
        );
    }

    // Update roaster/meeting board or room UI
    updateRoster(): void {
        // let rosterText = '';
        // for (const attendeeId in this.roster) {
        //     rosterText +=
        //         '<li class="list-group-item d-flex justify-content-between align-items-center">';
        //     rosterText += this.roster[attendeeId].name;
        //     let score = this.roster[attendeeId].score;
        //     if (!score) {
        //         score = 0;
        //     }
        //     score = Math.floor(score * 100);
        //     if (score) {
        //         rosterText += ` (${score})`;
        //     }
        //     rosterText += '<span class="badge badge-pill ';
        //     let status = '';
        //     if (this.roster[attendeeId].signalStrength < 1) {
        //         status = '&nbsp;';
        //         rosterText += 'badge-warning';
        //     } else if (this.roster[attendeeId].signalStrength === 0) {
        //         status = '&nbsp;';
        //         rosterText += 'badge-danger';
        //     } else if (this.roster[attendeeId].muted) {
        //         status = 'MUTED';
        //         rosterText += 'badge-secondary';
        //     } else if (this.roster[attendeeId].active) {
        //         status = 'SPEAKING';
        //         rosterText += 'badge-success';
        //     } else if (this.roster[attendeeId].volume > 0) {
        //         status = '&nbsp;';
        //         rosterText += 'badge-success';
        //     }
        //     rosterText += `">${status}</span></li>`;
        // }
        // const roster = document.getElementById('roster');
        // if (roster.innerHTML !== rosterText) {
        //     roster.innerHTML = rosterText;
        // }
    }

    layoutVideoTiles(): void {
        // if (!this.meetingSession) {
        //     return;
        // }
        // const selfAttendeeId = this.meetingSession.configuration.credentials.attendeeId;
        // const selfTileId = this.tileIdForAttendeeId(selfAttendeeId);
        // const visibleTileIndices = this.visibleTileIndices();
        // let activeTileId = this.activeTileId();
        // const selfIsVisible = visibleTileIndices.includes(this.tileIdToTileIndex[selfTileId]);
        // if (visibleTileIndices.length === 2 && selfIsVisible) {
        //     activeTileId = this.tileIndexToTileId[
        //         visibleTileInavigatorndices[0] === selfTileId ? visibleTileIndices[1] : visibleTileIndices[0]
        //         ];
        // }
        // const hasVisibleActiveSpeaker = visibleTileIndices.includes(
        //     this.tileIdToTileIndex[activeTileId]
        // );
        // if (this.activeSpeakerLayout && hasVisibleActiveSpeaker) {
        //     this.layoutVideoTilesActiveSpeaker(visibleTileIndices, activeTileId);
        // } else {
        //     this.layoutVideoTilesGrid(visibleTileIndices);
        // }
    }

    //////////////////////////////  Setup Screen Viewing for UI  /////////////////////////////////////////////

    // Def: Setup screen viewing UI
    private setupScreenViewing(): void {
        const self = this;
        this.meetingSession.screenShareView.registerObserver({
            streamDidStart(screenMessageDetail: ScreenMessageDetail): void {
                const rosterEntry = self.roster[screenMessageDetail.attendeeId];
                // document.getElementById('nameplate-17').innerHTML = rosterEntry ? rosterEntry.name : '';
            },
            // tslint:disable-next-line:variable-name
            streamDidStop(_screenMessageDetail: ScreenMessageDetail): void {
                // document.getElementById('nameplate-17').innerHTML = 'No one is sharing screen';
            },
        });
    }

    ////////////////////////////////////////////////////////////////////////////

    // audioVideoDidStartConnecting(reconnecting: boolean): void {
    //     this.log(`session connecting. reconnecting: ${reconnecting}`);
    // }

    // audioVideoDidStart(): void {
    //     this.log('session started');
    // }

    // audioVideoDidStop(sessionStatus: MeetingSessionStatus): void {
    //     this.log(`session stopped from ${JSON.stringify(sessionStatus)}`);
    //     if (sessionStatus.statusCode() === MeetingSessionStatusCode.AudioCallEnded) {
    //         this.log(`meeting ended`);
    //         // @ts-ignore
    //         window.location = window.location.pathname;
    //     }
    // }

    // videoTileDidUpdate(tileState: VideoTileState): void {
    //     this.log(`video tile updated: ${JSON.stringify(tileState, null, '  ')}`);
    //     const tileIndex = tileState.localTile
    //         ? 16
    //         : this.tileOrganizer.acquireTileIndex(tileState.tileId);
    //     const tileElement = document.getElementById(`tile-${tileIndex}`) as HTMLDivElement;
    //     const videoElement = document.getElementById(`video-${tileIndex}`) as HTMLVideoElement;
    //     const nameplateElement = document.getElementById(`nameplate-${tileIndex}`) as HTMLDivElement;
    //     this.log(`binding video tile ${tileState.tileId} to ${videoElement.id}`);
    //     this.audioVideo.bindVideoElement(tileState.tileId, videoElement);
    //     this.tileIndexToTileId[tileIndex] = tileState.tileId;
    //     this.tileIdToTileIndex[tileState.tileId] = tileIndex;
    //     // TODO: enforce roster names
    //     new TimeoutScheduler(200).start(() => {
    //         const rosterName = this.roster[tileState.boundAttendeeId]
    //             ? this.roster[tileState.boundAttendeeId].name
    //             : '';
    //         if (nameplateElement.innerHTML !== rosterName) {
    //             nameplateElement.innerHTML = rosterName;
    //         }
    //     });
    //     tileElement.style.display = 'block';
    //     this.layoutVideoTiles();
    // }

    // videoTileWasRemoved(tileId: number): void {
    //     this.log(`video tile removed: ${tileId}`);
    //     this.hideTile(this.tileOrganizer.releaseTileIndex(tileId));
    // }

    // videoAvailabilityDidChange(availability: MeetingSessionVideoAvailability): void {
    //     this.canStartLocalVideo = availability.canStartLocalVideo;
    //     this.log(`video availability changed: canStartLocalVideo  ${availability.canStartLocalVideo}`);
    // }

    // hideTile(tileIndex: number): void {
    //     const tileElement = document.getElementById(`tile-${tileIndex}`) as HTMLDivElement;
    //     tileElement.style.display = 'none';
    //     this.layoutVideoTiles();
    // }

    // tileIdForAttendeeId(attendeeId: string): number | null {
    //     for (const tile of this.audioVideo.getAllVideoTiles()) {
    //         const state = tile.state();
    //         if (state.boundAttendeeId === attendeeId) {
    //             return state.tileId;
    //         }
    //     }
    //     return null;
    // }

    // activeTileId(): number | null {
    //     for (const attendeeId in this.roster) {
    //         if (this.roster[attendeeId].active) {
    //             return this.tileIdForAttendeeId(attendeeId);
    //         }
    //     }
    //     return null;
    // }


    // visibleTileIndices(): number[] {
    //     let tiles: number[] = [];
    //     const screenViewTileIndex = 17;
    //     for (let tileIndex = 0; tileIndex <= screenViewTileIndex; tileIndex++) {
    //         const tileElement = document.getElementById(`tile-${tileIndex}`) as HTMLDivElement;
    //         if (tileElement.style.display === 'block') {
    //             if (tileIndex === screenViewTileIndex) {
    //                 // Hide videos when viewing screen
    //                 for (const tile of tiles) {
    //                     const tileToSuppress = document.getElementById(`tile-${tile}`) as HTMLDivElement;
    //                     tileToSuppress.style.visibility = 'hidden';
    //                 }
    //                 tiles = [screenViewTileIndex];
    //             } else {
    //                 tiles.push(tileIndex);
    //             }
    //         }
    //     }
    //     return tiles;
    // }

    // layoutVideoTilesActiveSpeaker(visibleTileIndices: number[], activeTileId: number): void {
    //     const tileArea = document.getElementById('tile-area') as HTMLDivElement;
    //     const width = tileArea.clientWidth;
    //     const height = tileArea.clientHeight;
    //     const widthToHeightAspectRatio = 16 / 9;
    //     const maximumRelativeHeightOfOthers = 0.3;
    //
    //     const activeWidth = width;
    //     const activeHeight = width / widthToHeightAspectRatio;
    //     const othersCount = visibleTileIndices.length - 1;
    //     let othersWidth = width / othersCount;
    //     let othersHeight = width / widthToHeightAspectRatio;
    //     if (othersHeight / activeHeight > maximumRelativeHeightOfOthers) {
    //         othersHeight = activeHeight * maximumRelativeHeightOfOthers;
    //         othersWidth = othersHeight * widthToHeightAspectRatio;
    //     }
    //     if (othersCount === 0) {
    //         othersHeight = 0;
    //     }
    //     const totalHeight = activeHeight + othersHeight;
    //     const othersTotalWidth = othersWidth * othersCount;
    //     const othersXOffset = width / 2 - othersTotalWidth / 2;
    //     const activeYOffset = height / 2 - totalHeight / 2;
    //     const othersYOffset = activeYOffset + activeHeight;
    //
    //     let othersIndex = 0;
    //     for (let i = 0; i < visibleTileIndices.length; i++) {
    //         const tileIndex = visibleTileIndices[i];
    //         const tileId = this.tileIndexToTileId[tileIndex];
    //         let x = 0,
    //             y = 0,
    //             w = 0,
    //             h = 0;
    //         if (tileId === activeTileId) {
    //             x = 0;
    //             y = activeYOffset;
    //             w = activeWidth;
    //             h = activeHeight;
    //         } else {
    //             x = othersXOffset + othersIndex * othersWidth;
    //             y = othersYOffset;
    //             w = othersWidth;
    //             h = othersHeight;
    //             othersIndex += 1;
    //         }
    //         this.updateTilePlacement(tileIndex, x, y, w, h);
    //     }
    // }

    // updateTilePlacement(tileIndex: number, x: number, y: number, w: number, h: number): void {
    //     const tile = document.getElementById(`tile-${tileIndex}`) as HTMLDivElement;
    //     const insetWidthSize = 4;
    //     const insetHeightSize = insetWidthSize / (16 / 9);
    //     tile.style.position = 'absolute';
    //     tile.style.left = `${x + insetWidthSize}px`;
    //     tile.style.top = `${y + insetHeightSize}px`;
    //     tile.style.width = `${w - insetWidthSize * 2}px`;
    //     tile.style.height = `${h - insetHeightSize * 2}px`;
    //     tile.style.margin = '0';
    //     tile.style.padding = '0';
    //     tile.style.visibility = 'visible';
    //     const video = document.getElementById(`video-${tileIndex}`) as HTMLDivElement;
    //     if (video) {
    //         video.style.position = 'absolute';
    //         video.style.left = '0';
    //         video.style.top = '0';
    //         video.style.width = `${w}px`;
    //         video.style.height = `${h}px`;
    //         video.style.margin = '0';
    //         video.style.padding = '0';
    //         video.style.borderRadius = '8px';
    //     }
    //     const nameplate = document.getElementById(`nameplate-${tileIndex}`) as HTMLDivElement;
    //     const nameplateSize = 24;
    //     const nameplatePadding = 10;
    //     nameplate.style.position = 'absolute';
    //     nameplate.style.left = '0px';
    //     nameplate.style.top = `${h - nameplateSize - nameplatePadding}px`;
    //     nameplate.style.height = `${nameplateSize}px`;
    //     nameplate.style.width = `${w}px`;
    //     nameplate.style.margin = '0';
    //     nameplate.style.padding = '0';
    //     nameplate.style.paddingLeft = `${nameplatePadding}px`;
    //     nameplate.style.color = '#fff';
    //     nameplate.style.backgroundColor = 'rgba(0,0,0,0)';
    //     nameplate.style.textShadow = '0px 0px 5px black';
    //     nameplate.style.letterSpacing = '0.1em';
    //     nameplate.style.fontSize = `${nameplateSize - 6}px`;
    // }

    // layoutVideoTilesGrid(visibleTileIndices: number[]): void {
    //     const tileArea = document.getElementById('tile-area') as HTMLDivElement;
    //     const width = tileArea.clientWidth;
    //     const height = tileArea.clientHeight;
    //     const widthToHeightAspectRatio = 16 / 9;
    //     let columns = 1;
    //     let totalHeight = 0;
    //     let rowHeight = 0;
    //     for (; columns < 18; columns++) {
    //         const rows = Math.ceil(visibleTileIndices.length / columns);
    //         rowHeight = width / columns / widthToHeightAspectRatio;
    //         totalHeight = rowHeight * rows;
    //         if (totalHeight <= height) {
    //             break;
    //         }
    //     }
    //     for (let i = 0; i < visibleTileIndices.length; i++) {
    //         const w = Math.floor(width / columns);
    //         const h = Math.floor(rowHeight);
    //         const x = (i % columns) * w;
    //         const y = Math.floor(i / columns) * h + (height / 2 - totalHeight / 2);
    //         this.updateTilePlacement(visibleTileIndices[i], x, y, w, h);
    //     }
    // }


    // connectionDidBecomePoor(): void {
    //     this.log('connection is poor');
    // }

    // connectionDidSuggestStopVideo(): void {
    //     this.log('suggest turning the video off');
    // }

    // videoSendDidBecomeUnavailable(): void {
    //     this.log('sending video is not available');
    // }


    ////////////////////////////////////////////////
    //////////////// CUSTOM CODE //////////////////
    ///////////////////////////////////////////////

    // Def: Create room and join room as attendee
    // Params: meeting id, attendee name and region
    // Return <promise>: join info with meeting and attendee info
    joinMeeting(body) {
        return this.http.post(this.apiUrl + 'join', body, {
            headers: new HttpHeaders(
                {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    Authorization: 'JWT ' + this.storage.retrieveJWT().jwt,
                    Accept: '*/*',
                }),
            observe: 'response' as 'body'
        });
    }

    // Def: Initialize session, get audio and video permissions, initialize and get list of all audio and video devices
    // Params: res.joinInfo.Meeting and res.joinInfo.Attendee  subscribed to joinMeeting()
    // Return:
    startSession(meeting, attendee) {
        this.initializeMeetingSession(
            new MeetingSessionConfiguration(meeting, attendee)
        );
    }


    // Def: Get attendee info
    // Params: Attendee and title
    // Return <promise>: Attendee info
    getAttendeeInfo(body) {
        return this.http.post(this.apiUrl + 'attendee', body);
    }

    // Def: Start and subscribe to meeting
    // Params:
    // Return <promise>:
    startMeeting() {
        new AsyncScheduler().start(async () => {
            await this.join();
        });
    }

    // Def: Return roster to meeting component
    async getRoster() {
        return this.roster;
    }
}
