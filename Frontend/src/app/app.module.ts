import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { JoinTempComponent } from './join-temp/join-temp.component';
import { MeetingTempComponent } from './meeting-temp/meeting-temp.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { MeetingComponent } from './pages/video/meeting/meeting.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AccountComponent } from './pages/auth/account/account.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HomeComponent } from './pages/dashboard/home/home.component';

import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import { ClipboardModule } from 'ngx-clipboard';
import { JoinComponent } from './pages/video/join/join.component';


import {CustomUrlSerializer} from './custom/CustomUrlSerializer';
import {UrlSerializer} from "@angular/router";
import { JoinAttendeeComponent } from './pages/video/join-attendee/join-attendee.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    JoinTempComponent,
    MeetingTempComponent,
    MeetingComponent,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    HomeComponent,
    JoinComponent,
    JoinAttendeeComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        NgZorroAntdModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        CarouselModule,
        MatCardModule,
        MatBadgeModule,
        ClipboardModule,
    ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, { provide: UrlSerializer, useClass: CustomUrlSerializer}],
  bootstrap: [AppComponent]
})
export class AppModule { }
