import {Component, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ChimeService} from '../../services/api/chime.service';
import {Router, ActivatedRoute} from '@angular/router';
import {interval} from 'rxjs';

@Component({
  selector: 'ngx-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})


export class MeetingComponent implements OnInit {

  constructor(@Inject(DOCUMENT) document, public chime: ChimeService,
              private router: Router, private route: ActivatedRoute) {
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
  deviceManagementFLAG = true;

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

  // speaker test flag to allow testing of audio output after the test audio clip has finished playing
  speakerTestFlag = false;

  // vairables to hold meeting attendees info. roster holds ids of attends and roster data maps id to the rest info
  roster = [];
  rosterData = [];

  ngOnInit() {
    // set meeting name
    this.meetingName = this.route.snapshot.paramMap.get('meeting_id');
    // setup dropdowns for device management
    this.initializeUIComponents();
  }

  // Def: setup dropdowns for device management. Fetch available devices from chime
  async initializeUIComponents() {
    this.videoInputDevices = await this.chime.audioVideo.listVideoInputDevices();
    this.audioOutputDevices = await this.chime.audioVideo.listAudioOutputDevices();
    this.audioInputDevices = await this.chime.audioVideo.listAudioInputDevices();
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
    this.chime.audioVideo.startVideoPreviewForVideoInput(document.getElementById('video-preview') as HTMLVideoElement);
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
  }

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
    await this.chime.startMeeting();
    this.deviceManagementFLAG = false;
    // update roster of attendees every x ms
    this.subscribe = this.source.subscribe(async val => {
      this.roster = await this.chime.getRoster();
      this.rosterData = Object.keys(this.roster);
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
      this.chime.audioVideo.startLocalVideoTile();
    } else {
      // Stop video input
      this.chime.audioVideo.stopLocalVideoTile();
    }
  }

  // Def: helper method to sleep for x microseconds
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}
