import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'users', loadChildren: './users/users/users.module#UsersPageModule' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'login', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'clients', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'checklist', loadChildren: './formlist/checklists/checklist.module#ChecklistPageModule' },
  { path: 'welcome', loadChildren: './welcome/welcome.module#WelcomePageModule' },
  { path: 'calculators', loadChildren: './formlist/calculators/calculators.module#CalculatorsPageModule' },
  { path: 'dfr-rrrtabs', loadChildren: './dfrRRR/dfr-rrrtabs/dfr-rrrtabs.module#DfrRRRTabsPageModule' },
  { path: 'dfr-techlist', loadChildren: './dfrRRR/dfr-techlist/dfr-techlist.module#DfrTechlistPageModule' },
  { path: 'dwm', loadChildren: './dwm/dwm.module#DwmPageModule' }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
