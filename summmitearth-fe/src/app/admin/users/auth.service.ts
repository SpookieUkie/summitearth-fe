import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import * as moment from "moment";
import { Tokens } from '../../shared/models/tokens.model';
import { environment } from './../../../environments/environment';
import { UserModel } from './user.model';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private path = '/users/';
    private path2 = '/auth/';

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  constructor(private http: HttpClient, private router: Router, private sharedService: SharedService) {}
    //environment.apiURL + this.path2 + 'authenticate/', {username, password}

  signinUser(username: string, password: string ): Observable<boolean> {
    return this.http.post<any>(`${environment.apiURL + this.path2}authenticate`, { username, password })
      .pipe(
        tap(val => this.doLoginUser(username, val.data)),
        mapTo(true),
        catchError(error => {
          console.log(error.error);
          return of(false);
        }));
  }

  logout() {
     console.log ('logout');
    return this.http.post<any>(`${environment.apiURL + this.path2}logout`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
       console.log (error.error);
        this.backToLogin();
        return of(false);
      }));
  }

  isLoggedIn() {
    return !!this.getJwtToken();
  }

  refreshToken() {
     // Get user id to validate they are still active
    const user: any  =  JSON.parse(localStorage.getItem('user'));
    
    return this.http.post<any>(`${environment.apiURL + this.path2 + 'id/' + user._id }/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      if (tokens === null || tokens === undefined) {
        this.backToLogin();
      }  else {
        this.storeJwtToken(tokens.jwt);
      }
    }));
  }

  backToLogin() {
      this.router.navigate(['/']);
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private doLoginUser(username: string, data: any) {
    const tokens = new Tokens();
    tokens.jwt = data.jwt;
    tokens.refreshToken = data.refreshToken;
    this.loggedUser = username;
    localStorage.setItem('user', JSON.stringify(data.user));
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
    this.backToLogin();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem('user');
  }

  getAllUsers() {
    return this.http.get(environment.apiURL + this.path + 'all/');
  }

  getSingleUser(id) {
    return this.http.get(environment.apiURL + this.path + 'id/' + id);
  }

  register(userModel: UserModel) {
    delete userModel._id;
    return this.http.post(environment.apiURL + this.path + 'register/', userModel);
  }

  updateUser(userModel: UserModel) {
    return this.http.put(environment.apiURL + this.path + 'id/' + userModel._id, userModel);
  }

  goToLogin() {
    this.sharedService.showNotification('User Session has Expired. Please log in again', 'danger');
    this.router.navigate(['/']);
  }

  getCurrentUser() {
      const user: UserModel = JSON.parse(localStorage.getItem('user'));
      return user;
  }

  public validateAppVersion() {
    return this.http.get(environment.apiURL + this.path2 + 'appversion/');
  }



}
