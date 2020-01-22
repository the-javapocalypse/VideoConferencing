import {Component, OnInit, OnDestroy, HostListener} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {ChimeService} from '../../services/api/chime.service';
import {LocalService} from '../../services/storage/local.service';
import {LocalStorageService} from "../../../../../Frontend (copy)/src/app/services/storage/local-storage.service";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.sass']
})
export class JoinComponent implements OnInit {

  isCollapsed = true;
  focus;
  focus1;
  focus2;
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
    // Get meeting id from url
    this.meetingId = this.route.snapshot.paramMap.get('ID');
  }

  onSubmitJoinChat(formData) {
    // Grab meeting id from url
    let meetingId = this.route.snapshot.paramMap.get('ID');
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
