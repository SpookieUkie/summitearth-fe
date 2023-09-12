import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

import { CalculatorsPage } from './calculators.page';
import { NappratesComponent } from './napprates/napprates.component';
import { ClappratesComponent } from './claapprates/clapprates.component';

import { TabMenuModule } from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';


const routes: Routes = [
  { path: '', component: CalculatorsPage },
  { path: 'nappcalc', component: NappratesComponent },
  { path: 'clappcalc', component: ClappratesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    TabMenuModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CalculatorsPage, NappratesComponent, ClappratesComponent]
})
export class CalculatorsPageModule {}
