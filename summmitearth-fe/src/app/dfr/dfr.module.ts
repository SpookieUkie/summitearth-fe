import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { DFRPage } from './dfr.page';
import { HeaderSummaryComponent } from './header-summary/header-summary.component';
import { ActivitySummaryComponent } from './activity-summary/activity-summary.component';
import { TooltipModule } from 'primeng/tooltip';
import { PopoverComponent } from '../shared/popover/popover.component';
import { DailySummaryComponent } from './daily-summary/daily-summary.component';
import { DailyRigComponent } from './daily-summary/daily-rig/daily-rig.component';
import { DfrPhotoComponent } from './daily-summary/dfr-photo/dfr-photo.component';
import { DailyMudComponent } from './daily-summary/daily-mud/daily-mud.component';
import { DailyMudListComponent } from './daily-summary/daily-mud-list/daily-mud-list.component';
import { MudSummaryListPage } from './summary/mud-summary-list/mud-summary-list.page';
import { MudSummaryItemComponent } from './summary/mud-summary-item/mud-summary-item.component';
import { SharedModule } from '../shared/shared.module';
import { DailyMudLocationComponent } from './daily-summary/daily-mud-location/daily-mud-location.component';
import { DisposalSummaryComponent } from './daily-summary/disposal-summary/disposal-summary.component';
import { CrossingSummaryComponent } from './daily-summary/crossing-summary/crossing-summary.component';
import { DailySalinityComponent } from './daily-summary/daily-salinity/daily-salinity.component';
import { PdfviewComponent } from './pdfview/pdfview.component';
import { DisposalSummaryLockedComponent } from './daily-summary/disposal-summary-locked/disposal-summary-locked.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { SubmitGuard } from '../shared/guards/submit.guard';
import { PhotoviewerComponent } from '../shared/photoviewer/photoviewer.component';
import { DfrHeaderMenuComponent } from './dfr-header-menu/dfr-header-menu.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    TooltipModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: DFRPage, canActivate: [AuthGuard, SubmitGuard]},
      { path: ':id/dfrrigs', component: DailySummaryComponent, canActivate: [AuthGuard]},
      { path: ':dfrid/dfrrigs/:rigid', component: DailyRigComponent, canActivate: [AuthGuard]},
      { path: ':dfrid/dfrrigs/:rigid/photo/:photoURL', component: PhotoviewerComponent, canActivate: [AuthGuard]},
      { path: ':dfrid/mud', component: DailyMudListComponent, canActivate: [AuthGuard]},
      { path: ':dfrid/mudsummary', component: MudSummaryListPage, canActivate: [AuthGuard]}
    ])
  ],
  declarations: [DFRPage, 
    HeaderSummaryComponent,
    ActivitySummaryComponent,
    DailySummaryComponent,
    DailyRigComponent,
    DfrPhotoComponent,
    DailyMudComponent,
    DailyMudLocationComponent,
    DailyMudListComponent,
    DailySalinityComponent,
    DisposalSummaryComponent,
    DisposalSummaryLockedComponent,
    MudSummaryListPage,
    MudSummaryItemComponent,
    CrossingSummaryComponent,
    DfrHeaderMenuComponent,
    PdfviewComponent
  ]
})
export class DFRPageModule {}
