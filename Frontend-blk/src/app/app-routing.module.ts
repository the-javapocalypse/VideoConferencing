import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { ProfilepageComponent } from './pages/examples/profilepage/profilepage.component';
import { RegisterpageComponent } from './pages/examples/registerpage/registerpage.component';
import { LandingpageComponent } from './pages/examples/landingpage/landingpage.component';
import { JoinMeetingComponent } from './pages/join-meeting/join-meeting.component';
import {MeetingComponent} from './pages/meeting/meeting.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: IndexComponent },
  { path: 'profile', component: ProfilepageComponent },
  { path: 'register', component: RegisterpageComponent },
  { path: 'landing', component: LandingpageComponent },
  { path: 'join/:meeting_id', component: JoinMeetingComponent },
  { path: 'meeting/:meeting_id', component: MeetingComponent }

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: false
    })
  ],
  exports: []
})
export class AppRoutingModule {}