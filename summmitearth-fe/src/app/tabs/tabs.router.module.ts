import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: '../tab1/tab1.module#Tab1PageModule'
          }
        ]
      },
      {
        path: 'dfr',
        children: [
          {
            path: '',
            loadChildren: '../dfr/dfr.module#DFRPageModule'
          },
          {
            path: ':id',
            loadChildren: '../dfr/dfr.module#DFRPageModule'
          },
          {
            path: ':dfrid/dfrrigs',
            loadChildren: '../dfr/dfr.module#DFRPageModule'
          },
          {
            path: ':dfrid/dfrrigs/:rigid',
            loadChildren: '../dfr/dfr.module#DFRPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
