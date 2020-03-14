import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ChimeService} from '../../../services/api/chime.service';
import {LocalStorageService} from '../../../services/storage/local-storage.service';
import {CryptoService} from '../../../services/util/crypto.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RestService} from '../../../services/api/rest.service';

@Component({
    selector: 'app-join-attendee',
    templateUrl: './join-attendee.component.html',
    styleUrls: ['./join-attendee.component.sass']
})
export class JoinAttendeeComponent implements OnInit {


    meetingId = null;
    digest = null;
    attendeeName = null;
    joiningFlag = false;
    joinErrorFlag = false;
    invalidInviteLinkFlag = false;

    attendeeJoinForm: FormGroup;

    // tslint:disable-next-line:max-line-length
    constructor(private route: ActivatedRoute,
                private router: Router,
                private chime: ChimeService,
                private localStorage: LocalStorageService,
                private crypto: CryptoService,
                private formBuilder: FormBuilder,
                private api: RestService) {
    }


    ngOnInit() {
        // set spinner until room is validated
        this.joiningFlag = true;
        // reset error flag
        this.joinErrorFlag = false;
        // Check if user's roaster info is already present in localstorage
        if (this.localStorage.roasterInfoIsSet()) {
            // join meeting
            this.joinMeetingTrigger(this.localStorage.getRoasterInfo().meetingId, this.localStorage.getRoasterInfo().attendeeName);
        }
        // Grab meeting digest from url
        this.digest = this.route.snapshot.paramMap.get('digest');

        // Decrypt digest to get meeting id
        this.meetingId = this.crypto.decrypt(this.digest);

        // Check if decryption successful
        if (this.meetingId === '' || this.meetingId === undefined) {
            this.meetingId = 'Invalid invitation';
            this.invalidInviteLinkFlag = true;
            this.joiningFlag = false; // reset spinner
        } else {
            // check if room is valid
            this.api.roomIsValid(this.digest).subscribe(
                (res: any) => {
                    // if room and digest both are valid
                    // separate name from email of room creator
                    this.meetingId = this.meetingId.split('~~~')[0];
                    this.joiningFlag = false; // reset spinner
                },
                (error: any) => {
                    // if invalid
                    this.meetingId = 'Invalid invitation';
                    this.invalidInviteLinkFlag = true;
                    this.joiningFlag = false; // reset spinner
                }
            );
        }

        // Initialize form validators
        this.attendeeJoinForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', [Validators.required]],
        });
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
                // console.log(err);
                this.joinErrorFlag = true;
                this.joiningFlag = false; // reset spinner flag
            }
        );

    }

    // convenience getter for easy access to form fields
    get f() {
        return this.attendeeJoinForm.controls;
    }

    onSubmit() {
        // stop here if form is invalid
        if (this.attendeeJoinForm.invalid) {
            return;
        }
    }

}
