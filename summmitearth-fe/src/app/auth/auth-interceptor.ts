import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../admin/users/auth.service';
import { UserModel } from '../admin/users/user.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    constructor(private router: Router, private sharedService: SharedService, private authService: AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log ('Intercept');
        const idToken = localStorage.getItem('id_token');
        const user: any = localStorage.getItem('user') ;
        const userId = user._id;
        console.log (req);
        console.log ('userid');
        console.log(userId);
        if (idToken) {
           
            const cloned = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + idToken)});

            return next.handle(cloned).pipe(
                catchError((error: HttpErrorResponse) => {
                  if (error.status !== 401) {
                    // 401 handled in auth.interceptor
                    console.log ('err' + error.message);
                    this.authService.goToLogin();
                  }
                  return throwError(error);
                })
            );
        } else {
            console.log ('fail' + req.body);
            return next.handle(req);
        }
    }
}