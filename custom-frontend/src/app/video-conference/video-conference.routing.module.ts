import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChimeService} from "../services/api/chime.service";
import {LocalService} from "../services/storage/local.service";


const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    ChimeService,
    LocalService
  ]
})
export class VideoConferenceRoutingModule { }
