import { NgModule } from '@angular/core';
import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule, NbIconModule,
    NbInputModule, NbListModule,
    NbMenuModule, NbProgressBarModule,
    NbSelectModule,
    NbStepperModule, NbTabsetModule, NbUserModule
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { JoinComponent } from './join/join.component';
import { MeetingComponent } from './meeting/meeting.component';
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        PagesRoutingModule,
        ThemeModule,
        NbMenuModule,
        DashboardModule,
        ECommerceModule,
        MiscellaneousModule,
        NbCardModule,
        NbInputModule,
        NbButtonModule,
        NbStepperModule,
        FormsModule,
        NbSelectModule,
        NbProgressBarModule,
        NbActionsModule,
        NbTabsetModule,
        NbListModule,
        NbUserModule,
        NbIconModule,
    ],
  declarations: [
    PagesComponent,
    JoinComponent,
    MeetingComponent,
  ],
})
export class PagesModule {
}
