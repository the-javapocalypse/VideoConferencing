import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ChimeService} from '../../../services/api/chime.service';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.sass']
})
export class JoinComponent implements OnInit {

    // Data variables
    digest = '';

    // Control Flags
    joiningFlag = false;
    joinErrorFlag = false;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private chime: ChimeService) {
    }

    ngOnInit() {
        // Grab meeting id from url
        this.digest = this.route.snapshot.paramMap.get('digest');
    }


    // Join meeting method
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
                // console.log(err);
                this.joinErrorFlag = true;
                this.joiningFlag = false; // reset spinner flag
            }
        );

    }

}
