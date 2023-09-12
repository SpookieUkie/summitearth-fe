import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/admin/users/auth.service';
import { SharedService } from '../shared.service';
import { DfrService } from 'src/app/dfr/dfr.service';
import { DfrModel } from 'src/app/dfr/dfr-model';


@Injectable({
  providedIn: 'root'
})
export class SubmitGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, 
    private sharedService: SharedService, private dfrService: DfrService) { }

  // View will load the DFR
  canActivate() {
    let valid = true;
    const user = this.authService.getCurrentUser();
    let sub = this.dfrService.getCurrentDFR().subscribe((val: any) => {
        const dfr: DfrModel = val;
        if (dfr !== null && dfr.dfrStatus === 'Submitted' && !user.isAdmin) {
            this.sharedService.showNotification('Daily Field Report is Submitted and cannot be changed.', 'danger');
            valid = false;
        }
    });
    sub.unsubscribe();
    if (!valid) {
        this.router.navigate(['/', 'tabs']);
    }
    return this.authService.isLoggedIn();
    
  }
}
