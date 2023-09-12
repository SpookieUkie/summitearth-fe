import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DfrModel } from './dfr-model';
import {map} from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'Moment';
import { AuthService } from '../admin/users/auth.service';
import { CacheSaveDataService } from '../auth/cache-save-data.service';


@Injectable({
  providedIn: 'root'
})
export class DfrService {
  constructor(private router: Router,
      private httpClient: HttpClient,
      private cacheSaveDataService: CacheSaveDataService,
      private authService: AuthService) {
  }

  private path = '/dfrs';
  private currentDFR = new BehaviorSubject<DfrModel>(null);

  public getCurrentDFR() {
    return this.currentDFR.asObservable();
  }

  public setCurrentDFR(dfr) {
    this.currentDFR.next(dfr);
    this.cacheSaveDataService.setItem('currentdfr', dfr);
  }

   // TODO: Ensure the user is still set to new DFR
  public resetSelectedDFR(projectNumber) {
    const user = this.authService.getCurrentUser();
    const dfr = new DfrModel(null, null, null, null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null );
                     dfr.dfrDate =  new Date();
                     dfr.projectNumber = projectNumber;
                     dfr.dfrStatus = 'Open';
                     dfr.dfrStatusSubmitDate = null;
                     dfr.createdByUserId = user._id;
                     dfr.createdByFullName = user.firstName + ' ' + user.lastName;
                     dfr.assignedToUserId = user._id;
                     dfr.assignedToFullName = user.firstName + ' ' + user.lastName;
                     dfr.summitFieldRepresentative = user.firstName + ' ' +  user.lastName;
                     dfr.summitFieldContactInformation = user.cellPhone + ' ' +  user.emailAddress;
    this.currentDFR.next(dfr);
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
  public saveDFR(dfrModel: DfrModel) {
    if (dfrModel == null || dfrModel._id === undefined || dfrModel._id === null) {
      const data = JSON.parse(JSON.stringify(dfrModel));
      delete data._id;
      return this.httpClient.post(environment.apiURL + this.path, data)
      .pipe(
          map((res: any) => {
            return res.data;
          })
        );
    } else {
      return this.httpClient.put(environment.apiURL + this.path + '/id/' + dfrModel._id, dfrModel)
        .pipe(
            map((res: any) => {
              return res.data;
            })
          );
    }
  }

  public submitDFR(dfrModel: DfrModel) {
    return this.httpClient.put(environment.apiURL + this.path + '/submitDFR/' + dfrModel._id, dfrModel);
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
