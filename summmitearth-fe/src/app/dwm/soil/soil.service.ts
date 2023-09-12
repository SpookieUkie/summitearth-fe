import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/admin/users/auth.service';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { SoilModel } from './soil.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SoilService {
 
    constructor(private router: Router,
      private httpClient: HttpClient,
      private cacheSaveDataService: CacheSaveDataService,
      private authService: AuthService,
      private formBuilder: FormBuilder) {
  }
  
  private path = '/dwm/soil';
  private currentRec$ = new BehaviorSubject<SoilModel>(null);
  private currentForm$: BehaviorSubject<FormGroup | undefined> =
        new BehaviorSubject(this.formBuilder.group(new SoilModel()));
  
  public getCurrentGen() {
    return this.currentRec$.asObservable();
  }
  
  public getCurrentGenForm() {
    return this.currentForm$.asObservable();
  }

  public saveReport(report: SoilModel) {
    if (report == null || report._id === undefined || report._id === null) {
      const data = JSON.parse(JSON.stringify(report));
      delete data._id;
      return this.httpClient.post(environment.apiURL + this.path, data)
      .pipe(
          map((res: any) => {
            return res.data;
          })
        );
    } else {
      return this.httpClient.put(environment.apiURL + this.path + '/id/' + report._id, report)
        .pipe(
            map((res: any) => {
              return res.data;
            })
          );
    }
  }
}
