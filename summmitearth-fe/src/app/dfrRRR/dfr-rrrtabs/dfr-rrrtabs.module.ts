import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { DfrRRRTabsPage } from './dfr-rrrtabs.page';
import { DfrRrrVegetationSummaryComponent } from '../dfr-rrr-vegetation-summary/dfr-rrr-vegetation-summary.component';
import { DfrRrrAttachmentsComponent } from '../dfr-rrr-attachments/dfr-rrr-attachments.component';
import { DfrRrrCostsComponent } from '../dfr-rrr-costs/dfr-rrr-costs.component';


const routes: Routes = [
  { path: ':id', component: DfrRRRTabsPage,
  children: [
    {path: 'dfrvegetationsummary', component: DfrRrrVegetationSummaryComponent},
    {path: 'dfrattachments', component: DfrRrrAttachmentsComponent},
    {path: 'dfrcosts', component: DfrRrrCostsComponent}
    ]},
  {}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DfrRRRTabsPage, DfrRrrVegetationSummaryComponent, DfrRrrAttachmentsComponent, DfrRrrCostsComponent]
})
export class DfrRRRTabsPageModule {}
