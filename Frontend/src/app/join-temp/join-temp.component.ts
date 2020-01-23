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

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private router: Router, private chime: ChimeService, private localStorage: LocalStorageService) {
    // Check if user's roaster info is already present in localstorage
    if (this.localStorage.roasterInfoIsSet()) {
      // join meeting
      this.joinMeetingTrigger(this.localStorage.getRoasterInfo().meetingId, this.localStorage.getRoasterInfo().attendeeName);
    }
  }


  ngOnInit() {
  }

  onSubmitJoinChat(formData) {
    // Grab meeting id from url
    let meetingId = this.route.snapshot.paramMap.get('meeting_id');
    let attendeeName = formData.attendeeName;
    let region = 'us-east-1'; // default region

    this.localStorage.setRoasterInfo({
      meetingId: meetingId,
      attendeeName: attendeeName
    });

    // join meeting
    this.joinMeetingTrigger(meetingId, attendeeName);
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
      }
    );

  }

}
