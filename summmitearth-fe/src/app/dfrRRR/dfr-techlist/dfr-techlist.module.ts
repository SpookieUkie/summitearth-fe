import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DfrTechlistPage } from './dfr-techlist.page';


const routes: Routes = [
  { path: '', component: DfrTechlistPage},
 
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DfrTechlistPage]
})
export class DfrTechlistPageModule {}
