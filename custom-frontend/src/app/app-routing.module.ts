import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JoinComponent} from './video-conference/join/join.component';
import {MeetingComponent} from './video-conference/meeting/meeting.component';

const routes: Routes = [
  { path: 'join/:ID', component:  JoinComponent},
  { path: 'meeting/:ID', component:  MeetingComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
