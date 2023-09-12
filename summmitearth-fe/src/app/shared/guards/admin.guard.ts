import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/admin/users/auth.service';
import { SharedService } from '../shared.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private sharedService: SharedService) { }

  canActivate() {
    const user = this.authService.getCurrentUser();
    if (!user || !user.isAdmin) {
      this.sharedService.showNotification('Invalid Access Attempt. This has been logged as a security violation', 'danger');
      this.router.navigate(['/']);
    }
    return this.authService.isLoggedIn();
  }
}
