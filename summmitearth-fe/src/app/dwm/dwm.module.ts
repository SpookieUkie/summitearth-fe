import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DwmPage } from './dwm.page';
import { GeneralComponent } from './general/general.component';
import { SharedModule } from '../shared/shared.module';
import { TopmenuComponent } from './topmenu/topmenu.component';
import { LandComponent } from './land/land.component';
import { WaterComponent } from './water/water.component';
import { SoilComponent } from './soil/soil.component';
import { NewJobComponent } from './newjob/newjob.component';

const routes: Routes = [
  {
    path: '',
    component: DwmPage
  },
  {
    path: 'newjob',
    component: NewJobComponent
  },
  {
    path: ':id',
   // component: ,
    children: [
      {path: 'general', component: GeneralComponent},
      {path: 'land', component: LandComponent},
      {path: 'soil', component: SoilComponent},
      {path: 'water', component: WaterComponent}
    ]
  } /*,
  {
    path: ':id/general/',
    component: GeneralComponent
  } */
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DwmPage, GeneralComponent, TopmenuComponent, LandComponent, WaterComponent, 
   SoilComponent, NewJobComponent]
})
export class DwmPageModule {}
