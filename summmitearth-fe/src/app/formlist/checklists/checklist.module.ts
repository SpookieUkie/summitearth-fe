import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChecklistPage } from './checklist.page';
import { SharedModule } from '../../shared/shared.module';
import { DailyAuditDwmComponent } from './dailyauditdwm/dailyauditdwm.component';

import { ChecklistoptionsComponent } from 'src/app/shared/checklistoptions/checklistoptions.component';
import { ChecklistoptionslistComponent } from 'src/app/shared/checklistoptionslist/checklistoptionslist.component';
import { DailyauditdwmlistComponent } from './dailyauditdwmlist/dailyauditdwmlist.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { PhotoviewerComponent } from 'src/app/shared/photoviewer/photoviewer.component';


const routes: Routes = [
  {
    path: '',
    component: ChecklistPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'dailyauditdwmlist',
    component: DailyauditdwmlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dailyauditdwmlist/dailyauditdwm',
    component: DailyAuditDwmComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dailyauditdwmlist/dailyauditdwm/id/:dailyauditdwm',
    component: DailyAuditDwmComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'photoid/:id/photo/:photourl',
    component: PhotoviewerComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChecklistPage,  DailyauditdwmlistComponent,  DailyAuditDwmComponent,
    ChecklistoptionsComponent, ChecklistoptionslistComponent],
})
export class ChecklistPageModule{}

