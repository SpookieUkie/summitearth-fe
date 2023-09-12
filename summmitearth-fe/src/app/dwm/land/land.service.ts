import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/admin/users/auth.service';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { LandModel } from './land.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class LandService {
 
    constructor(private router: Router,
      private httpClient: HttpClient,
      private cacheSaveDataService: CacheSaveDataService,
      private authService: AuthService,
      private formBuilder: FormBuilder) {
  }
  
  private path = '/dwm/';
  private path2 = '/land/';
  private currentRec$ = new BehaviorSubject<LandModel>(null);
  private currentForm$: BehaviorSubject<FormGroup | undefined> =
        new BehaviorSubject(this.formBuilder.group(new LandModel()));

  private currentList$ = new BehaviorSubject<LandModel[]>(null);
  
  public getCurrentGen() {
    return this.currentRec$.asObservable();
  }
  
  public getCurrentGenForm() {
    return this.currentForm$.asObservable();
  }

  public getCurrentList(jobid) {
    return this.httpClient.get(environment.apiURL + this.path +  jobid + this.path2)
      .pipe(
          map((res: any) => {
            //return res.data;
    console.log (res.data);
    console.log ('-----------');
            this.currentList$.next(res.data) ;
            return this.currentList$.asObservable();
          })
        );
    //return this.currentList$.asObservable();
  }

  public saveReport(report: LandModel) {
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
