import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/admin/users/auth.service';
import { SharedService } from '../shared.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private sharedService: SharedService) { }

  canActivate() {
    console.log ('auth guard');
    if (!this.authService.isLoggedIn()) {
      this.sharedService.showNotification('User session is not valid. Please log in again', 'danger');
      this.router.navigate(['/']);
    }
    return this.authService.isLoggedIn();
  }
}
