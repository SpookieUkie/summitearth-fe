import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DfrlistComponent } from './dfrlist/dfrlist.component';
import { RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/primeng';

const routes = [
   {path: 'dfr', component: DfrlistComponent}
];

@NgModule({
  declarations: [DfrlistComponent],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    MessageModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DfrModule { }
