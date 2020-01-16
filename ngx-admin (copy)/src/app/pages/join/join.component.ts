import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ChimeService} from '../../services/api/chime.service';
import {StorageService} from '../../services/localStorage/storage.service';

@Component({
  selector: 'ngx-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
})
export class JoinComponent implements OnInit {

  meetingId = null;
  attendeeName = null;


  constructor(private route: ActivatedRoute, private router: Router, private chime: ChimeService,
              private localStorage: StorageService) {
    // Check if user's roaster info is already present in localstorage
    if (this.localStorage.roasterInfoIsSet()) {
      // join meeting
      this.joinMeetingTrigger(this.localStorage.getRoasterInfo().meetingId,
        this.localStorage.getRoasterInfo().attendeeName);
    }
  }

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('ID');
  }

  /////////////////// CHIME SHIT STARTS ///////////////////////

  onSubmitJoinChat(formData) {
    // Grab meeting id from url
    this.attendeeName = formData.attendeeName;
    let region = 'us-east-1'; // default region

    this.localStorage.setRoasterInfo({
      meetingId: this.meetingId,
      attendeeName: this.attendeeName,
    });

    // join meeting
    this.joinMeetingTrigger(this.meetingId, this.attendeeName);
  }

  async joinMeetingTrigger(meetingId, attendeeName) {
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
      },
    );

  }

}
