import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JoinTempComponent} from './join-temp/join-temp.component';
import {MeetingTempComponent} from './meeting-temp/meeting-temp.component';
import {MeetingComponent} from './pages/video/meeting/meeting.component';


const routes: Routes = [
  { path: 'join/:meeting_id', component: JoinTempComponent },
  { path: 'meeting/:meeting_id', component: MeetingTempComponent},
  { path: 'conference/:meeting_id', component: MeetingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
