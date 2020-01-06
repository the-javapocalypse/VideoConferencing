import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ChimeService} from '../../services/api/chime.service';
import {LocalStorageService} from '../../services/storage/local-storage.service';

@Component({
    selector: 'app-join-meeting',
    templateUrl: './join-meeting.component.html',
    styleUrls: ['./join-meeting.component.scss']
})
export class JoinMeetingComponent implements OnInit, OnDestroy {

    isCollapsed = true;
    focus;
    focus1;
    focus2;
    meetingId = null;
    attendeeName = null;

    // tslint:disable-next-line:max-line-length
    constructor(private route: ActivatedRoute, private router: Router, private chime: ChimeService, private localStorage: LocalStorageService) {
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e) {
        const squares1 = document.getElementById('square1');
        const squares2 = document.getElementById('square2');
        const squares3 = document.getElementById('square3');
        const squares4 = document.getElementById('square4');
        const squares5 = document.getElementById('square5');
        const squares6 = document.getElementById('square6');
        const squares7 = document.getElementById('square7');
        const squares8 = document.getElementById('square8');

        const posX = e.clientX - window.innerWidth / 2;
        const posY = e.clientY - window.innerWidth / 6;

        squares1.style.transform =
            'perspective(500px) rotateY(' +
            posX * 0.05 +
            'deg) rotateX(' +
            posY * -0.05 +
            'deg)';
        squares2.style.transform =
            'perspective(500px) rotateY(' +
            posX * 0.05 +
            'deg) rotateX(' +
            posY * -0.05 +
            'deg)';
        squares3.style.transform =
            'perspective(500px) rotateY(' +
            posX * 0.05 +
            'deg) rotateX(' +
            posY * -0.05 +
            'deg)';
        squares4.style.transform =
            'perspective(500px) rotateY(' +
            posX * 0.05 +
            'deg) rotateX(' +
            posY * -0.05 +
            'deg)';
        squares5.style.transform =
            'perspective(500px) rotateY(' +
            posX * 0.05 +
            'deg) rotateX(' +
            posY * -0.05 +
            'deg)';
        squares6.style.transform =
            'perspective(500px) rotateY(' +
            posX * 0.05 +
            'deg) rotateX(' +
            posY * -0.05 +
            'deg)';
        squares7.style.transform =
            'perspective(500px) rotateY(' +
            posX * 0.02 +
            'deg) rotateX(' +
            posY * -0.02 +
            'deg)';
        squares8.style.transform =
            'perspective(500px) rotateY(' +
            posX * 0.02 +
            'deg) rotateX(' +
            posY * -0.02 +
            'deg)';
    }

    ngOnInit() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('register-page');
        this.onMouseMove(event);
        // Get meeting id from url
        this.meetingId = this.route.snapshot.paramMap.get('meeting_id');
    }

    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('register-page');
    }


    /////////////////// CHIME SHIT STARTS ///////////////////////
    async joinMeetingTrigger(formData) {
        // Grab meeting id from url
        let meetingId = this.route.snapshot.paramMap.get('meeting_id');
        let attendeeName = formData.attendeeName;
        let region = 'us-east-1'; // default region

        // Save info (if not set) in localstorage to directly continue to meeting next time visiting the page
        if (!this.localStorage.roasterInfoIsSet()) {
            this.localStorage.setRoasterInfo({
                meetingId: meetingId,
                attendeeName: attendeeName
            });
        }

        console.log('Joining meting...');
        this.chime.joinMeeting({
            title: meetingId,
            name: attendeeName
        }).subscribe((res: any) => {
                console.log('Successfully joined...');
                this.chime.startSession(res.JoinInfo.Meeting, res.JoinInfo.Attendee);
                this.router.navigate(['/meeting/' + meetingId]);
            },
            (err: any) => {
                console.log(err);
            }
        );

    }
}
