import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoConferenceRoutingModule } from './video-conference.routing.module';
import { JoinComponent } from './join/join.component';
import { MeetingComponent } from './meeting/meeting.component';



@NgModule({
  declarations: [JoinComponent, MeetingComponent],
  imports: [
    CommonModule,
    VideoConferenceRoutingModule
  ],
  exports: [
    JoinComponent,
    MeetingComponent
  ],
  providers: []
})
export class VideoConferenceModule { }
