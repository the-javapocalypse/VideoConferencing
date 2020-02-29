import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ChimeService} from '../services/api/chime.service';
import {Router, ActivatedRoute} from '@angular/router';
import {interval} from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd';
import {LocalStorageService} from '../services/storage/local-storage.service';

@Component({
    selector: 'app-meeting-temp',
    templateUrl: './meeting-temp.component.html',
    styleUrls: ['./meeting-temp.component.sass']
})
export class MeetingTempComponent implements OnInit, OnDestroy {


    constructor(@Inject(DOCUMENT) document,
                public chime: ChimeService,
                private router: Router,
                private route: ActivatedRoute,
                private toast: NzMessageService,
                public storage: LocalStorageService,
    ) {

        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            if (!this.deviceManagementFLAG) {
                this.chime.leave();
                this.subscribe.unsubscribe();
            }
            return event;
        });

    }

    // interval to get roster data asynchronously from chime and update UI.
    // invkoed in joinMeeting()
    source = interval(500);
    subscribe = null;

    // Default label text for device management dropdown
    currentAudioInputDevice = 'Audio Input Device';
    currentAudioOutputDevice = 'Audio Output Device';
    currentVideoInputDevice = 'Video Input Device';

    // Default ids for device management dropdown
    currentAudioInputDeviceID = 0;
    currentAudioOutputDeviceID = 0;
    currentVideoInputDeviceID = 0;

    // Flag to render device management screen or meeting screen
    deviceManagementFLAG = false;

    // Meeting Name
    meetingName = 'Meeting Demo';

    // List of available devices for input and output
    audioOutputDevices = [];
    audioInputDevices = [];
    videoInputDevices = [];

    // value of audio preview bar, i.e input audio level, default is zero
    audioInputPreview = 0;

    // input video quality default label
    videoQualityPreview = 'Select Video Quality';

    // variable to see if audio is muted or not
    audioInputUnmute = true;

    // variable to see if video input is on or not
    videoInput = false;


    activeTileStack = [];

    activeTileUserId = '';

    // variable to see if screen sharing input is on or not
    shareScreen = false;

    // speaker test flag to allow testing of audio output after the test audio clip has finished playing
    speakerTestFlag = false;

    // vairables to hold meeting attendees info. roster holds ids of attends and roster data maps id to the rest info
    roster = [];
    rosterData = [];


    deviceScreenInitFLAG = false;


    isCollapsed = true;


    tileUserMapping = {};
    videoElemUserMapping = {};

    uploadBandwidth = 0;
    downloadBandwidth = 0;

    showStatsFLAG = true;

    toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
    }

    ngOnInit() {
        this.deviceScreenInitFLAG = false;
        // set meeting name
        this.meetingName = this.route.snapshot.paramMap.get('meeting_id');
        // setup dropdowns for device management
        this.initializeUIComponents();
    }

    ngOnDestroy() {
        // this.leaveMeeting();
    }

    // Def: setup dropdowns for device management. Fetch available devices from chime
    async initializeUIComponents() {
        try {
            this.videoInputDevices = await this.chime.audioVideo.listVideoInputDevices();
            this.audioOutputDevices = await this.chime.audioVideo.listAudioOutputDevices();
            this.audioInputDevices = await this.chime.audioVideo.listAudioInputDevices();

            // setup default devices at index 0
            if (this.audioInputDevices.length > 0) {
                this.currentAudioInputDevice = this.audioInputDevices[0].label;
                this.currentAudioInputDeviceID = this.audioInputDevices[0].deviceId;
                this.updateCurrentAudioInputDevice(this.currentAudioInputDevice, this.currentAudioInputDeviceID);
            }
            if (this.audioOutputDevices.length > 0) {
                this.currentAudioOutputDevice = this.audioOutputDevices[0].label;
                this.currentAudioOutputDeviceID = this.audioOutputDevices[0].deviceId;
                this.updateCurrentAudioOutputDevice(this.currentAudioOutputDevice, this.currentAudioOutputDeviceID);
            }
            if (this.videoInputDevices.length > 0) {
                this.currentVideoInputDevice = this.videoInputDevices[0].label;
                this.currentVideoInputDeviceID = this.videoInputDevices[0].deviceId;
                this.updateCurrentVideoInputDevice(this.currentVideoInputDevice, this.currentVideoInputDeviceID);
            } else {
                this.currentVideoInputDevice = 'None';
                this.currentVideoInputDeviceID = null;
                this.updateCurrentVideoInputDevice(this.currentVideoInputDevice, this.currentVideoInputDeviceID);
            }
            this.updateVideoQualityPreview('540p');

            // Screen Loaded, show UI
            this.deviceScreenInitFLAG = true;
        } catch (err) {
            // Devices not initialized which means user haven't joined the meeting, so redirect to /join
            // this.router.navigate(['/join/' + this.meetingName]);
        }
    }

    // Def: invoked when audio input device is changed. It updates chime's audio input source and UI
    async updateCurrentAudioInputDevice(label, id) {
        this.currentAudioInputDevice = label;
        this.currentAudioInputDeviceID = id;
        console.log('updating audio input device');
        await this.chime.audioVideo.chooseAudioInputDevice(id);
        this.startAudioPreview();
    }

    // Def: invoked when audio output device is changed. It updates chime's audio output source and UI
    async updateCurrentAudioOutputDevice(label, id) {
        this.currentAudioOutputDevice = label;
        this.currentAudioOutputDeviceID = id;
        console.log('updating audio output device');
        await this.chime.audioVideo.chooseAudioOutputDevice(id);
        const audioMix = document.getElementById('meeting-audio') as HTMLAudioElement;
        await this.chime.audioVideo.bindAudioElement(audioMix);
    }

    // Def: invoked when video input device is changed. It updates chime's video input source and UI
    async updateCurrentVideoInputDevice(label, id) {
        this.currentVideoInputDevice = label;
        this.currentVideoInputDeviceID = id;
        console.log('updating video input device');
        await this.chime.audioVideo.chooseVideoInputDevice(id);

        if (this.deviceManagementFLAG) {
            if (id === null) {
                this.chime.audioVideo.stopVideoPreviewForVideoInput(document.getElementById('video-preview') as HTMLVideoElement);
            } else {
                this.chime.audioVideo.startVideoPreviewForVideoInput(document.getElementById('video-preview') as HTMLVideoElement);
            }
        } else {
            this.chime.audioVideo.startLocalVideoTile();
        }
    }


    // Def: invoked when video input quality is changed. It updates chime's video input quality and UI
    async updateVideoQualityPreview(videoInputQuality) {
        this.videoQualityPreview = videoInputQuality;
        switch (videoInputQuality) {
            case '360p':
                this.chime.audioVideo.chooseVideoInputQuality(640, 360, 15, 600);
                break;
            case '540p':
                this.chime.audioVideo.chooseVideoInputQuality(960, 540, 15, 1400);
                break;
            case '720p':
                this.chime.audioVideo.chooseVideoInputQuality(1280, 720, 15, 1400);
                break;
        }
    }

    // Def: Play demo audio clip to test audio output
    playAudio() {
        this.speakerTestFlag = true;
        let audio = new Audio();
        audio.src = '../../assets/audio/audiotest.wav';
        audio.load();
        audio.play();
        (async () => {
            await this.delay(6000);
            this.speakerTestFlag = false;
        })();
    }


    // Def: Get sound level of audio input and update the progress bar to visualize audio input loudness
    private analyserNodeCallback = () => {
    };

    startAudioPreview(): void {
        // this.setAudioPreviewPercent(0);
        const analyserNode = this.chime.audioVideo.createAnalyserNodeForAudioInput();
        if (!analyserNode) {
            return;
        }
        if (!analyserNode.getFloatTimeDomainData) {
            // document.getElementById('audio-preview').parentElement.style.visibility = 'hidden';
            return;
        }
        const data = new Float32Array(analyserNode.fftSize);
        let frameIndex = 0;
        this.analyserNodeCallback = () => {
            if (frameIndex === 0) {
                analyserNode.getFloatTimeDomainData(data);
                const lowest = 0.01;
                let max = lowest;
                for (const f of data) {
                    max = Math.max(max, Math.abs(f));
                }
                let normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
                let percent = Math.min(Math.max(normalized * 100, 0), 100);
                this.audioInputPreview = percent;
            }
            frameIndex = (frameIndex + 1) % 2;
            requestAnimationFrame(this.analyserNodeCallback);
        };
        requestAnimationFrame(this.analyserNodeCallback);
    }

    // Def: show meeting screen and subscribe to meeting using chime's api
    async joinMeeting() {
        // Join meeting
        await this.chime.startMeeting();
        // Stop video preview
        this.chime.audioVideo.stopVideoPreviewForVideoInput(document.getElementById(
            'video-preview'
        ) as HTMLVideoElement);
        // release video input device
        console.log('custom : releasing video device');
        await this.chime.audioVideo.chooseVideoInputDevice(null);
        // Set meeting screen flag
        this.deviceManagementFLAG = false;
        // update roster of attendees every x ms
        this.subscribe = this.source.subscribe(async val => {
            this.roster = await this.chime.getRoster();
            this.rosterData = Object.keys(this.roster);
            console.log('custom: ' + JSON.stringify(this.roster));
            this.updateTile();
            this.uploadBandwidth = this.chime.uploadBandwidth;
            this.downloadBandwidth = this.chime.downloadBandwidth;
        });
        this.updateCurrentAudioInputDevice(this.currentAudioInputDevice, this.currentAudioInputDeviceID);
        this.updateCurrentAudioOutputDevice(this.currentAudioOutputDevice, this.currentAudioOutputDeviceID);
    }

    // Def: Mute|Unmute audio input
    muteHandler() {
        // Toggle flag
        this.audioInputUnmute = !this.audioInputUnmute;
        // Unmute audio input
        if (this.audioInputUnmute) {
            this.chime.audioVideo.realtimeUnmuteLocalAudio();
        } else {
            // Mute audio input
            if (this.chime.audioVideo.realtimeCanUnmuteLocalAudio()) {
                this.chime.audioVideo.realtimeMuteLocalAudio();
            }
        }
    }

    videoInputHandler() {
        // Toggle flag
        this.videoInput = !this.videoInput;
        if (this.videoInput) {
            // Start video input
            this.updateCurrentVideoInputDevice(this.currentVideoInputDevice, this.currentVideoInputDeviceID);
            this.chime.audioVideo.startLocalVideoTile();
        } else {
            // Stop video input
            console.log('custom --- stopping video tile');
            this.chime.audioVideo.stopLocalVideoTile();
        }
        this.updateTile();
    }


    updateTile() {

        const tileCount = this.chime.audioVideo.getAllVideoTiles().length;

        for (const tile of this.chime.audioVideo.getAllVideoTiles()) {
            const state = tile.state();

            // New video
            if (this.tileUserMapping[state.boundAttendeeId] === undefined) {
                // store tile-user mapping
                this.tileUserMapping[state.boundAttendeeId] = state;
                // store videoElem-user mapping
                if (tileCount === 1) {
                    this.videoElemUserMapping[state.boundAttendeeId] = 'active';
                    this.activeTileUserId = state.boundAttendeeId;
                } else {
                    this.videoElemUserMapping[state.boundAttendeeId] = tileCount.toString();
                }
            } else {
                this.tileUserMapping[state.boundAttendeeId] = state;
            }


            // Update tile for active speaker
            if (this.roster[state.boundAttendeeId].volume > 60 && !this.roster[state.boundAttendeeId].muted && state.boundAttendeeId !== this.activeTileUserId) {
                let old_active = this.activeTileUserId;
                let new_active = state.boundAttendeeId;

                // get current elems
                let old_vid = document.getElementById(`video-` + this.videoElemUserMapping[old_active]) as HTMLVideoElement;
                let new_vid = document.getElementById(`video-` + this.videoElemUserMapping[new_active]) as HTMLVideoElement;

                // unbind old elems
                this.chime.audioVideo.unbindVideoElement(this.tileUserMapping[old_active].tileId);
                this.chime.audioVideo.unbindVideoElement(this.tileUserMapping[new_active].tileId);

                this.videoElemUserMapping[old_active] = this.videoElemUserMapping[new_active];
                this.videoElemUserMapping[new_active] = 'active';

                // bind new elems
                old_vid = document.getElementById(`video-` + this.videoElemUserMapping[old_active]) as HTMLVideoElement;
                new_vid = document.getElementById(`video-` + this.videoElemUserMapping[new_active]) as HTMLVideoElement;

                this.chime.audioVideo.bindVideoElement(this.tileUserMapping[old_active].tileId, old_vid);
                this.chime.audioVideo.bindVideoElement(this.tileUserMapping[new_active].tileId, new_vid);

                this.activeTileUserId = state.boundAttendeeId;
            } else {
                // get video elem
                const videoElement = document.getElementById(`video-` + this.videoElemUserMapping[state.boundAttendeeId]) as HTMLVideoElement;

                // bind elem
                this.chime.audioVideo.bindVideoElement(this.tileUserMapping[state.boundAttendeeId].tileId, videoElement);
            }


            console.log('tileRes: tile-user' + JSON.stringify(this.tileUserMapping));
            console.log('tileRes: video-user' + JSON.stringify(this.videoElemUserMapping));
        }

        // console.log('video: tiles -> ' + this.chime.audioVideo.getAllVideoTiles().length.toString());
        // let c = 1;
        // for (const tile of this.chime.audioVideo.getAllVideoTiles()) {
        //
        //     const state = tile.state();
        //
        //     const videoElement = document.getElementById(`video-` + c.toString()) as HTMLVideoElement;
        //
        //     this.chime.audioVideo.bindVideoElement(state.tileId, videoElement);
        //
        //     if (this.roster[state.boundAttendeeId].volume > 40 && !this.roster[state.boundAttendeeId].muted) {
        //         console.log('video: is actvie ' + this.roster[state.boundAttendeeId].name);
        //
        //         // Remove existing other active tile if present
        //         if (this.activeTileStack.length > 0) {
        //
        //             if (this.activeTileStack[0] !== c) {
        //
        //                 // Remove old tile
        //                 document.getElementById(`tile-` + this.activeTileStack[0].toString()).classList.remove('videoStreamActive');
        //                 document.getElementById(`tile-` + this.activeTileStack[0].toString()).classList.add('videoStream');
        //                 this.activeTileStack.pop();
        //
        //                 // New tile
        //                 this.activeTileStack.push(c);
        //                 document.getElementById(`tile-` + c.toString()).classList.remove('videoStream');
        //                 document.getElementById(`tile-` + c.toString()).classList.add('videoStreamActive');
        //             }
        //
        //         } else {
        //             this.activeTileStack.push(c);
        //             document.getElementById(`tile-` + c.toString()).classList.remove('videoStream');
        //             document.getElementById(`tile-` + c.toString()).classList.add('videoStreamActive');
        //         }
        //
        //
        //     }
        //     c++;
        // }
    }

    getActiveTileCount() {
        let counter = 0;
        for (const tile of this.chime.audioVideo.getAllVideoTiles()) {
            if (tile.state().active) {
                counter++;
            }
        }
        return counter;
    }


    // updateTile() {
    //     console.log(this.chime.audioVideo.getAllVideoTiles().length);
    //     // this.chime.audioVideo.startVideoPreviewForVideoInput(document.getElementById('video-self') as HTMLVideoElement);
    //     for (const tile of this.chime.audioVideo.getAllVideoTiles()) {
    //
    //         const state = tile.state();
    //         console.log(state);
    //         const videoElement = document.getElementById(`video-1`) as HTMLVideoElement;
    //         this.chime.audioVideo.bindVideoElement(state.tileId, videoElement);
    //
    //         // const state = tile.state();
    //         // console.log('custom ---');
    //         // console.log(JSON.stringify(state));
    //         // console.log('binding ' + `video-` + state.tileId.toString() + ' to ' + state.tileId.toString());
    //         // const videoElement = document.getElementById(`video-` + state.tileId.toString()) as HTMLVideoElement;
    //         // this.chime.audioVideo.bindVideoElement(state.tileId, videoElement);
    //
    //
    //         // if (state.active) {
    //         //     console.log('binding ' + `video-` + state.tileId.toString() + ' to ' + state.tileId.toString());
    //         //     const videoElement = document.getElementById(`video-` + state.tileId.toString()) as HTMLVideoElement;
    //         //     this.chime.audioVideo.bindVideoElement(state.tileId, videoElement);
    //         // } else {
    //         //     console.log('unbinding ' + `video-` + state.tileId.toString() + ' to ' + state.tileId.toString());
    //         //     const videoElement = document.getElementById(`video-` + state.tileId.toString()) as HTMLVideoElement;
    //         //     this.chime.audioVideo.bindVideoElement(state.tileId, videoElement);
    //         // }
    //     }
    // }
    //
    // bindTileToAttendee() {
    //     const videoElement = document.getElementById(`video-1`) as HTMLVideoElement;
    //     //     const nameplateElement = document.getElementById(`nameplate-${tileIndex}`) as HTMLDivElement;
    //     //     this.log(`binding video tile ${tileState.tileId} to ${videoElement.id}`);
    //     //     this.audioVideo.bindVideoElement(tileState.tileId, videoElement);
    // }


    shareScreenInputHandler() {
        // Toggle flag
        this.shareScreen = !this.shareScreen;
        if (this.shareScreen) {
            // Start screen share

        } else {
            // Stop screen share

        }
    }


    leaveMeeting() {
        this.chime.leave();
        this.subscribe.unsubscribe();
        this.router.navigate(['/join/' + this.meetingName]);
    }

    // Display Toast Message
    createToast(type: string, body: string): void {
        this.toast.create(type, body);
    }

    // Def: helper method to sleep for x microseconds
    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    toggleStatsFlag(){
        this.showStatsFLAG = !this.showStatsFLAG;
    }

}
