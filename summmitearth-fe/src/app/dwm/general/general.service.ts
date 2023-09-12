import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/admin/users/auth.service';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { GeneralFormModel } from './general-form.model';
import { GeneralModel } from './general.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { NewJobFormModel } from '../newjob/newjob-form.model';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
 
    constructor(private router: Router,
      private httpClient: HttpClient,
      private cacheSaveDataService: CacheSaveDataService,
      private authService: AuthService,
      private formBuilder: FormBuilder) {
  }
  
  private path = '/dwm/general';
  private currentRec$ = new BehaviorSubject<GeneralModel>(null);
  private currentForm$: BehaviorSubject<FormGroup | undefined> =
        new BehaviorSubject(this.formBuilder.group(new GeneralFormModel()));
  private newGenForm$: BehaviorSubject<FormGroup | undefined> =
        new BehaviorSubject(this.formBuilder.group(new NewJobFormModel()));
  
  public getCurrentGen() {
    if (this.currentRec$.value === null) {
      let val: any = localStorage.getItem('job');
      if (val != null) {
        this.currentRec$.next(JSON.parse(val));
      }
    }
    return this.currentRec$.asObservable();
  }
  
  public getCurrentGenForm() {
    return this.currentForm$.asObservable();
  }

  public getNewGenForm() {
    return this.newGenForm$.asObservable();
  }

  public setCurrentGen(item) {
    this.currentForm$.next(this.formBuilder.group(new GeneralFormModel()));
    this.currentRec$.next(item);
    localStorage.setItem('job', JSON.stringify(item));
    //this.cacheSaveDataService.setItem('currentdfrRRR', dfr);
  }


  public saveReport(report: GeneralModel) {
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

  public getJobListByDateAndAssignedToTechId(startDate: Date, endDate: Date, techId: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/startdate/' + startDate + '/enddate/' + endDate + '/id/' + techId)
    .pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }


  public getJobListByTechId(tech1Id: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/id/' + tech1Id)
    .pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

 public copyJob(jobId: string) {
  return this.httpClient.get(environment.apiURL  + this.path + '/copy/' + jobId)
  .pipe(
      map((res: any) => {
        return res.data;
      })
    );
 }
}
