import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ChimeService} from '../../../services/api/chime.service';
import {LocalStorageService} from '../../../services/storage/local-storage.service';
import {CryptoService} from '../../../services/util/crypto.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RestService} from '../../../services/api/rest.service';
import {UrlService} from "../../../services/util/url.service";


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
    roomName = '';

    attendeeJoinForm: FormGroup;

    // tslint:disable-next-line:max-line-length
    constructor(private route: ActivatedRoute,
                private router: Router,
                private chime: ChimeService,
                private localStorage: LocalStorageService,
                private crypto: CryptoService,
                private formBuilder: FormBuilder,
                private api: RestService,
                private url: UrlService) {
    }


    ngOnInit() {

        // Initialize form validators
        this.attendeeJoinForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            name: ['', [Validators.required]],
        });

        // Get info from local storage (if present)
        const userData = this.localStorage.retrieveJWT();
        if (userData !== null) {
            this.f.name.setValue(userData.userInfo.name);
            this.f.email.setValue(userData.userInfo.email);
        }

        // set spinner until room is validated
        this.joiningFlag = true;
        // reset error flag
        this.joinErrorFlag = false;

        // Grab meeting digest from url
        // this.digest = this.route.snapshot.paramMap.get('digest');

        this.route.queryParams.subscribe(params => {
            this.digest = params.room;


            // Decrypt digest to get meeting id
            this.meetingId = this.crypto.decrypt(this.digest);

            // Replace slash with code
            this.digest = this.url.encode(this.digest);

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
                        this.roomName = this.meetingId;
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
        });
    }


    async joinMeetingTrigger(meetingId, attendeeName) {
        console.log('Joining meting...');

        this.joiningFlag = true;  // flag to show spinner
        this.chime.joinMeeting({
            title: meetingId,
            name: attendeeName
        }).subscribe((res: any) => {
                console.log('Successfully joined...');

                // store roster info locally
                this.localStorage.setRoasterInfo({
                    meetingId,
                    attendeeName,
                    attendeeId: res.body.JoinInfo.Attendee.AttendeeId
                });

                this.chime.startSession(res.body.JoinInfo.Meeting, res.body.JoinInfo.Attendee);
                this.joiningFlag = false; // reset flag
                // this.router.navigate(['/meeting/' + meetingId]);
            },
            (err: any) => {
                console.log(err);
                this.joinErrorFlag = true;
                this.joiningFlag = false; // reset spinner flag
            }
        );

    }

    // convenience getter for easy access to form fields
    get f() {
        return this.attendeeJoinForm.controls;
    }

    // todo: If attendee got an account, redirect to login page.
    //  Home page will contain all available rooms attendee owns or is added too.
    //  At the moment, we process in either case
    onSubmit() {
        // stop here if form is invalid
        if (this.attendeeJoinForm.invalid) {
            return;
        }

        // If form is valid
        this.api.createAttendee(this.attendeeJoinForm.value).subscribe(
            (res: any) => {
                console.log(res);
                this.api.loginAttendee({
                    email: this.attendeeJoinForm.value.email
                }).subscribe(
                    (response: any) => {
                        /// !!!! Join in either case
                        this.localStorage.storeJWT(response.body.token, response.body.user); // store login info
                        // Add attendee to room
                        this.api.addAAttendeeToRoom({digest: this.url.decode(this.digest)}).subscribe(
                            (room: any) => {

                            },
                            (error: any) => {

                            }
                        );
                        this.joinMeetingTrigger(this.digest, this.attendeeJoinForm.value.name);
                    },
                    (error: any) => {
                        // Error in loggin in
                    }
                );
            },
            // Account already exists
            (err: any) => {
                console.log(err);
                this.api.loginAttendee({
                    email: this.attendeeJoinForm.value.email
                }).subscribe(
                    (response: any) => {
                        /// !!!! Join in either case
                        this.localStorage.storeJWT(response.body.token, response.body.user); // store login info
                        // Add attendee to room
                        this.api.addAAttendeeToRoom({digest: this.url.decode(this.digest)}).subscribe(
                            (room: any) => {

                            },
                            (error: any) => {

                            }
                        );
                        this.joinMeetingTrigger(this.digest, this.attendeeJoinForm.value.name);
                    },
                    (error: any) => {
                        /// error loggin in
                    }
                );
            }
        );
    }

}
