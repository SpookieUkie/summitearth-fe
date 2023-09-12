import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, throwError, BehaviorSubject, from, EMPTY, NEVER, of } from 'rxjs';
import { catchError, filter, take, switchMap, finalize, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../admin/users/auth.service';
import { Router } from '@angular/router';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { CacheSaveDataService } from './cache-save-data.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService, public cacheSaveDataService: CacheSaveDataService) { }

 intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

  // Check Cache for any post results and return that instead. Must check if value is an array or object with an array
    if (!this.cacheSaveDataService.status.connected && request.method === 'GET') {

        return from(this.getCachedResult(request)).pipe (
          mergeMap(data => {
            console.log(data);
            if (data === undefined || data === null) {
              return this.returnNext(request, next);
            } else {
              let val: any = {};
              if (Array.isArray(data.body)) {
                val.data = data.body;
              } else {
                // tslint:disable-next-line: forin
                for (const k in data.body) {
                  val.data = data.body[k];
                }
              }
              return of(new HttpResponse({ body: val }));
            }
          })
        )

    } else if (!this.cacheSaveDataService.status.connected && request.url.indexOf('authenticate') === -1
      && request.url.indexOf('logout') === -1  && (request.method === 'PUT' || request.method === 'POST')) {

      const result = this.cacheSaveDataService.setStorageRequest(request);

      return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                console.log('event--->>>', event);
            }
            return event;
        }),
        catchError((error: HttpErrorResponse) => {
            let data = {};
            data = {
                reason: error && error.error && error.error.reason ? error.error.reason : '',
                status: error.status
            };
            return throwError(error);
        }));

    } else {
        return this.returnNext(request, next);
    }
  }

  returnNext(request: HttpRequest<any>, next: HttpHandler) {
      const userId = this.getUserId();
      if (this.authService.getJwtToken()) {
        request = this.addToken(request, this.authService.getJwtToken(), userId);
      }

      return next.handle(request).pipe(catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
            if (error.status === 405) { //|| error.status === 500) {
              this.authService.backToLogin();
            }
          console.log('error, not logged in');
          return throwError(error);
        }
      }));
  }

  async getCachedResult(request) {
    const keys = await this.cacheSaveDataService.getKeys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.indexOf('reqcache') !== -1) {
        console.log ('------ key ' +  key);
        return  await this.getKeyValue(key, request);
      }
    }
    return  await null;
  }

  async getKeyValue(key, request) {
    const res = await this.cacheSaveDataService.get2(key);
    const val: any = res;
    if (val.url === request.url) {
      return val;
    }
  }

  private addToken(request: HttpRequest<any>, token: string, userId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'userId': userId
    });
    return request.clone({headers});
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const userId = this.getUserId();
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addToken(request, token.jwt, userId));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt, userId));
        }));
    }
  }

  private getUserId() {
    const user: any = JSON.parse(localStorage.getItem('user') );
    let userId = '0';
    if (user !== undefined && user !== null) {
      userId = user._id;
    }
    return userId;
  }

}
