import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ChimeService} from '../../../services/api/chime.service';
import {LocalStorageService} from '../../../services/storage/local-storage.service';
import {RestService} from '../../../services/api/rest.service';

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.sass']
})
export class JoinComponent implements OnInit {

    // Data variables
    digest = '';


    // User info from local storage
    userInfo = {
        id: undefined,
        name: undefined,
        email: undefined,
        role: undefined
    };

    // Control Flags
    joinErrorFlag = false;
    roomNotExistsFlag = false;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private chime: ChimeService,
                private storage: LocalStorageService,
                private api: RestService) {
    }

    ngOnInit() {
        // Grab meeting id from url
        this.digest = this.route.snapshot.paramMap.get('digest');
        // this.route.params.subscribe(params => {
        //     console.log(params.digest); // prints: referral_code=jk
        // });


        // Get user info from local storage
        this.userInfo = this.storage.retrieveJWT().userInfo;

        // Check if room exists
        this.checkRoomIsExists();
    }

    // Check if room is valid
    checkRoomIsExists() {
        this.api.roomIsValid(this.digest).subscribe(
            (res: any) => {
                this.joinMeetingTrigger(this.digest, this.userInfo.name);
            },
            (err: any) => {
                this.roomNotExistsFlag = false;
            }
        );
    }


    // Join meeting method
    async joinMeetingTrigger(meetingId, attendeeName) {
        console.log('Joining meting...');

        // store roster info locally
        this.storage.setRoasterInfo({
            meetingId,
            attendeeName
        });

        this.chime.joinMeeting({
            title: meetingId,
            name: attendeeName
        }).subscribe((res: any) => {
                console.log('Successfully joined...');
                this.chime.startSession(res.body.JoinInfo.Meeting, res.body.JoinInfo.Attendee);
                this.router.navigate(['/meeting/' + meetingId]);
            },
            (err: any) => {
                console.log(err);
                this.joinErrorFlag = true;
            }
        );
    }

}
