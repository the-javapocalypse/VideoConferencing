import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JoinTempComponent} from './join-temp/join-temp.component';
import {MeetingTempComponent} from './meeting-temp/meeting-temp.component';
import {MeetingComponent} from './pages/video/meeting/meeting.component';
import {AccountComponent} from './pages/auth/account/account.component';

const routes: Routes = [
  { path: 'account/:action', component: AccountComponent},
  { path: 'join/:meeting_id', component: JoinTempComponent },
  { path: 'meeting/:meeting_id', component: MeetingTempComponent},
  { path: 'conference/:meeting_id', component: MeetingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
