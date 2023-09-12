import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DailyAuditDwmModel } from './dailyauditdwm.model';
import { DailyAuditDWMFormModel } from './dailyauditdwm-form.model';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DailyauditdwmService {

  private path = '/dailyauditdwm';
  private pathExcel = '/dailyauditdwmexcel';

  private dailyAuditSub = new BehaviorSubject<DailyAuditDWMFormModel>(null);

  private dailyauditdwmSubject: BehaviorSubject<FormGroup | undefined> =
      new BehaviorSubject(this.formBuilder.group(new DailyAuditDWMFormModel()));

  public dailyauditdwm$: Observable<FormGroup> = this.dailyauditdwmSubject.asObservable();

  public dailyAuditDWMModel$: BehaviorSubject<DailyAuditDwmModel> = new BehaviorSubject<DailyAuditDwmModel>(null); // Current Obj

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  public getDailyAuditSub () {
    return this.dailyAuditSub.asObservable();
  }

  public clearFormSubject() {
    this.dailyauditdwmSubject.next(this.formBuilder.group(new DailyAuditDWMFormModel()));
    this.dailyAuditDWMModel$.next(new DailyAuditDwmModel());
   //this.dailyAuditDWMModel = new DailyAuditDwmModel();
  }

  public setSelectedDailyAudit(val) {
    this.dailyauditdwmSubject.next(this.formBuilder.group(new DailyAuditDWMFormModel()));
    this.dailyAuditDWMModel$.next(val);
   //this.dailyAuditDWMModel = new DailyAuditDwmModel();
  }

  public setDefaultValues(jobNumber, userId, fullName) {
    console.log('def vals');
    const mdl: DailyAuditDwmModel = this.dailyAuditDWMModel$.value;
    mdl.jobNumber = jobNumber;
    mdl.assignedToUserId = userId;
    mdl.reportStatus = 'Open';
    mdl.inspectionDate = new Date();
    mdl.environmentalTechnician = fullName;


    console.log(this.dailyAuditDWMModel$.value);

  }

  public updateNaNotes(key, value, label) {
    const model: DailyAuditDwmModel = this.dailyAuditDWMModel$.value;
    let isFound = false;
    if (model.naNotes === undefined) {
      model.naNotes =  [{key: key, value: value, label: label}];
    } else {
      model.naNotes.forEach(val => {
        if (val.key === key) {
            val.value = value;
            val.label = label;
            isFound = true;
        }
      });

      if (!isFound) {
        model.naNotes.push({key: key, value: value, label: label});
      }
    }
    this.dailyAuditDWMModel$.next(model);
    console.log (model.naNotes);
  }


  public getNaNoteByKey(key) {
    const val: DailyAuditDwmModel = this.dailyAuditDWMModel$.value;
    let  ref = '';
    if (val !== null && val !== undefined && val.naNotes !== undefined && val.naNotes !== null) {
      val.naNotes.forEach(val => {
        if (val.key === key) {
          ref = val.value;
        }
      });
    }
    console.log (key)
    console.log (ref)
    return ref;
  }

  // Must convert model to json and delete _id from saving new, otherwise the id will not come back, eventhough the record will save!!!!
  public saveReport(report: DailyAuditDwmModel) {
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

  public getSingleDailyAudit(id) {
    return this.httpClient.get(environment.apiURL + this.path + '/id/' + id)
    .pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  public getReportListByDateAndAssignedToUserId(startDate: Date, endDate: Date, assignedToUserId: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/startdate/' + startDate + '/enddate/' + endDate + '/id/' + assignedToUserId)
    .pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  public getReportListByDate(startDate: Date, endDate: Date) {
    return this.httpClient.get(environment.apiURL + this.path + '/startdate/' + startDate + '/enddate/' + endDate)
    .pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  public copyReport(id) {
    return this.httpClient.get(environment.apiURL  + this.path + '/copy/' + id)
    .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public delete(id: string) {
    return this.httpClient.delete(environment.apiURL + this.path + '/id/' + id);
  }

  public generateReport(id: string) {
    return this.httpClient.get(environment.apiURL + this.pathExcel + '/id/' + id);
  }

  public submitReport(report: DailyAuditDwmModel) {
    return this.httpClient.put(environment.apiURL + this.path + '/submit/' + report._id, report);
  }


}
