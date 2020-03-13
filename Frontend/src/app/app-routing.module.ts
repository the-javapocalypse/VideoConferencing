import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JoinTempComponent} from './join-temp/join-temp.component';
import {MeetingTempComponent} from './meeting-temp/meeting-temp.component';
import {MeetingComponent} from './pages/video/meeting/meeting.component';
import {AccountComponent} from './pages/auth/account/account.component';
import {HomeComponent} from './pages/dashboard/home/home.component';
import {AuthGuardService} from './services/guard/auth-guard.service';
import {JoinComponent} from './pages/video/join/join.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'account', component: AccountComponent},
  { path: 'join_old/:meeting_id', component: JoinTempComponent },
  { path: 'meeting_old/:meeting_id', component: MeetingTempComponent},
  { path: 'startMeeting/:digest', component: JoinComponent},
  { path: 'meeting/:meeting_id', component: MeetingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
