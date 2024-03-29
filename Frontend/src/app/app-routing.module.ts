import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JoinTempComponent} from './join-temp/join-temp.component';
import {MeetingTempComponent} from './meeting-temp/meeting-temp.component';
import {MeetingComponent} from './pages/video/meeting/meeting.component';
import {AccountComponent} from './pages/auth/account/account.component';
import {HomeComponent} from './pages/dashboard/home/home.component';
import {AuthGuardService} from './services/guard/auth-guard.service';
import {JoinComponent} from './pages/video/join/join.component';
import {JoinAttendeeComponent} from './pages/video/join-attendee/join-attendee.component';
import {LandingComponent} from './pages/landing/landing.component';
import {ActivateComponent} from './pages/auth/activate/activate.component';
import {CovidComponent} from './pages/covid/covid.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'account', component: AccountComponent},
  { path: 'covid', component: CovidComponent},
  { path: 'join_old/:meeting_id', component: JoinTempComponent },
  { path: 'meeting/:meeting_id', component: MeetingTempComponent},
  { path: 'join_room/:digest', component: JoinComponent},
  { path: 'join', component: JoinAttendeeComponent},
  { path: 'meeting_new/:meeting_id', component: MeetingComponent},
  { path: 'activate/:token', component: ActivateComponent},
  { path: 'landing', component: LandingComponent},
  { path: '', component: LandingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
