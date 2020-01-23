import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ChimeService} from '../services/api/chime.service';
import {LocalStorageService} from '../services/storage/local-storage.service';

@Component({
    selector: 'app-join-temp',
    templateUrl: './join-temp.component.html',
    styleUrls: ['./join-temp.component.sass']
})
export class JoinTempComponent implements OnInit {

    meetingId = null;
    attendeeName = null;
    joiningFlag = false;

    // tslint:disable-next-line:max-line-length
    constructor(private route: ActivatedRoute, private router: Router, private chime: ChimeService, private localStorage: LocalStorageService) {
        // Check if user's roaster info is already present in localstorage
        // if (this.localStorage.roasterInfoIsSet()) {
        //   // join meeting
        //   this.joinMeetingTrigger(this.localStorage.getRoasterInfo().meetingId, this.localStorage.getRoasterInfo().attendeeName);
        // }
    }


    ngOnInit() {
        // Grab meeting id from url
        this.meetingId = this.route.snapshot.paramMap.get('meeting_id');
    }

    onSubmitJoinChat(formData) {
        this.attendeeName = formData.attendeeName;
        let region = 'us-east-1'; // default region

        this.localStorage.setRoasterInfo({
            meetingId: this.meetingId,
            attendeeName: this.attendeeName
        });

        // join meeting
        this.joinMeetingTrigger(this.meetingId, this.attendeeName);
    }

    async joinMeetingTrigger(meetingId, attendeeName) {
        console.log('Joining meting...');
        this.joiningFlag = true;  // flag to show spinner
        this.chime.joinMeeting({
            title: meetingId,
            name: attendeeName
        }).subscribe((res: any) => {
                console.log('Successfully joined...');
                this.chime.startSession(res.JoinInfo.Meeting, res.JoinInfo.Attendee);
                this.joiningFlag = false; // reset flag
                this.router.navigate(['/meeting/' + meetingId]);
            },
            (err: any) => {
                console.log(err);
            }
        );

    }

}
