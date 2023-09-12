import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'Moment';
import { AuthService } from '../admin/users/auth.service';
import { CacheSaveDataService } from '../auth/cache-save-data.service';
import { DfrRRRModel } from './dfr-rrr.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DfrRRRFormModel } from './dfr-rrr-form.model';

@Injectable({
  providedIn: 'root'
})
export class DfrRRRService {
  constructor(private router: Router,
    private httpClient: HttpClient,
    private cacheSaveDataService: CacheSaveDataService,
    private authService: AuthService,
    private formBuilder: FormBuilder) {
}

private path = '/dfrrrr';
private currentDFR$ = new BehaviorSubject<DfrRRRModel>(null);

private currentDFRForm$: BehaviorSubject<FormGroup | undefined> =
      new BehaviorSubject(this.formBuilder.group(new DfrRRRFormModel));

public getCurrentDFR() {
  return this.currentDFR$.asObservable();
}

public getCurrentDFRForm() {
  return this.currentDFRForm$.asObservable();
}

public setCurrentDFR(dfr) {
  this.currentDFRForm$.next(this.formBuilder.group(new DfrRRRFormModel()));
  this.currentDFR$.next(dfr);
  this.cacheSaveDataService.setItem('currentdfrRRR', dfr);
}

 // TODO: Ensure the user is still set to new DFR
public resetSelectedDFR(projectNumber) {
  const user = this.authService.getCurrentUser();
  const dfr = new DfrRRRModel();
                   dfr.dfrDate =  new Date();
                   dfr.projectNumber = projectNumber;
                   dfr.projectType = 'rrrDFR';
                   dfr.dfrStatus = 'Open';
                   dfr.dfrStatusSubmitDate = null;
                   dfr.createdByUserId = user._id;
                   dfr.createdByFullName = user.firstName + ' ' + user.lastName;
                   dfr.assignedToUserId = user._id;
                   dfr.assignedToFullName = user.firstName + ' ' + user.lastName;
                  // dfr.summitFieldRepresentative = user.firstName + ' ' +  user.lastName;
                   //dfr.summitFieldContactInformation = user.cellPhone + ' ' +  user.emailAddress;
  this.currentDFR$.next(dfr);
}

public copyDFR(dfrId: string) {
  return this.httpClient.get(environment.apiURL  + this.path + '/copy/' + dfrId)
  .pipe(
      map((res: any) => {
        return res.data;
      })
    );
}


// Must convert model to json and delete _id from saving new, otherwise the id will not come back, eventhough the record will save!!!!
public saveDFR(DfrRRRModel: DfrRRRModel) {
  if (DfrRRRModel == null || DfrRRRModel._id === undefined || DfrRRRModel._id === null) {
    const data = JSON.parse(JSON.stringify(DfrRRRModel));
    delete data._id;
    return this.httpClient.post(environment.apiURL + this.path, data)
    .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  } else {
    return this.httpClient.put(environment.apiURL + this.path + '/id/' + DfrRRRModel._id, DfrRRRModel)
      .pipe(
          map((res: any) => {
            return res.data;
          })
        );
  }
}

public submitDFR(DfrRRRModel: DfrRRRModel) {
  return this.httpClient.put(environment.apiURL + this.path + '/submitDFR/' + DfrRRRModel._id, DfrRRRModel);
}

public getDFRList() {
  return this.httpClient.get(environment.apiURL + this.path);
}

public getDFRListByDate(startDate: Date, endDate: Date) {
  return this.httpClient.get(environment.apiURL + this.path + '/startdate/' + startDate + '/enddate/' + endDate)
  .pipe(
    map((res: any) => {
      return res.data;
    })
  );
}

public getDFRListByDateAndAssignedToUserId(startDate: Date, endDate: Date, assignedToUserId: string) {
  return this.httpClient.get(environment.apiURL + this.path + '/startdate/' + startDate + '/enddate/' + endDate + '/id/' + assignedToUserId)
  .pipe(
    map((res: any) => {
      return res.data;
    })
  );
}

public getDFRByDfrId(id: string) {
  return this.httpClient.get(environment.apiURL + this.path + '/id/' + id)
  .pipe(
    map((res: any) => {
      this.setCurrentDFR(res.data);
      return res.data;
    })
  );
}

public deleteDFR(id: string) {
  return this.httpClient.delete(environment.apiURL + this.path + '/id/' + id);
}
}
