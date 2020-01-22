import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoConferenceModule } from "./video-conference/video-conference.module";
import {ChimeService} from "./services/api/chime.service";
import {LocalService} from "./services/storage/local.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    VideoConferenceModule
  ],
  providers: [
    ChimeService,
    LocalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
