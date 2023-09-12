import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouteReuseStrategy } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { ProjectComponent } from './project/projecttype/projecttype.component';
import { AdminComponent } from './admin/admin.component';
import { ProjectlistComponent } from './project/projectlist/projectlist.component';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './users/users.component';
import { SignupComponent } from './users/signup/signup.component';
import { AdminoptionsComponent } from '../shared/adminoptions/adminoptions.component';
import { AdminoptionslistComponent } from '../shared/adminoptionslist/adminoptionslist.component';


import { DfrmanagementComponent } from './dfrmanagement/dfrmanagement.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AdminGuard } from '../shared/guards/admin.guard';
import { ClientsComponent } from './clients/client/clients.component';
import { ClientlistComponent } from './clients/clientlist/clientlist.component';
import { ChartModule } from 'primeng/chart';
import { ReportchartsComponent } from './reportcharts/reportcharts.component';
import { FieldticketoptionslistComponent } from './fieldticketoptions/fieldticketoptionslist/fieldticketoptionslist.component';
import { FieldticketoptionsComponent } from './fieldticketoptions/fieldticketoptionssingle/fieldticketoptions.component';
import { FieldticketoptionsconfigComponent } from './project/fieldticketoptionsconfig/fieldticketoptionsconfig.component';

import { FieldticketbuilderComponent } from './fieldticketbuilder/fieldticketbuilder.component';

import { TabMenuModule } from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import { DailyauditdwmmanagementComponent } from './dailyauditdwmmanagement/dailyauditdwmmanagement.component';
import { AdmintheadermenuComponent } from './admintheadermenu/admintheadermenu.component';
import { MudlistComponent } from './mudmanagement/mudlist/mudlist.component';
import { MuditemComponent } from './mudmanagement/muditem/muditem.component';
import { RrrdfrmanagementComponent } from './rrrdfrmanagement/rrrdfrmanagement.component';


@NgModule({
  declarations: [AdminComponent, ProjectComponent, ProjectlistComponent, ClientlistComponent, ClientsComponent, ReportchartsComponent,
    UsersComponent, SignupComponent, AdminoptionsComponent, AdminoptionslistComponent, DfrmanagementComponent,
    DailyauditdwmmanagementComponent, FieldticketoptionslistComponent, FieldticketoptionsComponent, RrrdfrmanagementComponent,
    FieldticketoptionsconfigComponent, FieldticketbuilderComponent, AdmintheadermenuComponent, MudlistComponent, MuditemComponent],
    providers: [
        AuthGuard,
        AdminGuard,
      ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ChartModule,
    TabMenuModule,
    TableModule,
    DropdownModule,
    TabViewModule,
    ButtonModule,
    RouterModule.forChild([
      { path: '', component: AdminComponent,  canActivate: [AuthGuard, AdminGuard] },
      { path: 'project', component: ProjectlistComponent,  canActivate: [AuthGuard, AdminGuard] },
      { path: 'project/:id', component: ProjectComponent,  canActivate: [AuthGuard, AdminGuard] },
      { path: 'users', component: UsersComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'users/add', component: SignupComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'users/id/:id', component: SignupComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'clients', component: ClientlistComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'clients/add', component: ClientsComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'clients/id/:id', component: ClientsComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'dfrs', component: DfrmanagementComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'rrrdfrs', component: RrrdfrmanagementComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'dailyauditdwm', component: DailyauditdwmmanagementComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'fieldticketbuilder/id/:id', component: FieldticketbuilderComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'fieldticketoptions', component: FieldticketoptionslistComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'fieldticketoptions/add', component: FieldticketoptionsComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'fieldticketoptions/id/:id', component: FieldticketoptionsComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'muds', component: MudlistComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'muds/add', component: MuditemComponent,  canActivate: [AuthGuard, AdminGuard]},
      { path: 'muds/id/:id', component: MuditemComponent,  canActivate: [AuthGuard, AdminGuard]},
    ])]
})
export class AdminModule {}
