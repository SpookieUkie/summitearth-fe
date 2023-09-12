import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DfrModel } from '../dfr-model';
import {map} from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DfrActivityModel } from './dfr-activity-model';
import { StringifyOptions } from 'querystring';


@Injectable({
  providedIn: 'root'
})
export class DfrActivityService {

  constructor(private router: Router,
      private httpClient: HttpClient) {
  }

  private path = '/dfractivity';
  private currentActivityDFR = new BehaviorSubject<DfrActivityModel>(null);

  private dfrProjectDisposalSummaryList = new Array();
  private dfrProjectDisposalSummaryList$: BehaviorSubject<any[] | undefined> = new BehaviorSubject(new Array<any>());
  public dfrProjectDisposalSummaryListObs = this.dfrProjectDisposalSummaryList$.asObservable();

  private dfrCrossingSummaryList = new Array();
  private dfrCrossingSummaryList$: BehaviorSubject<any[] | undefined> = new BehaviorSubject(new Array<any>());
  public dfrCrossingSummaryListObs = this.dfrCrossingSummaryList$.asObservable();


  public getCurrentActivityDFR() {
    console.log (this.currentActivityDFR.value);
    return this.currentActivityDFR.asObservable();
  }

  public setCurrentActivityDFR(dfrAct) {
    this.currentActivityDFR.next(dfrAct);
  }

  public resetSelectedDFR() {
    const dfrActivityModel = new DfrActivityModel( null, null, null,  null, null, new Array(), new Array(),  new Array(), 0);
      this.currentActivityDFR.next(dfrActivityModel);
  }

  public buildHeader() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    //headers = headers.append('Authorization', 'Bearer ' + this.token );
    return headers;
  }

  // Must convert model to json and delete _id from saving new, otherwise the id will not come back, eventhough the record will save!!!!
  public saveDFRAct(dfrActivityModel: DfrActivityModel, id: string) {
    if (dfrActivityModel == null || id === undefined || id === null) {
      const data = JSON.parse(JSON.stringify(dfrActivityModel));
      delete data._id;
      return this.httpClient.post(environment.apiURL + this.path, data)
        .pipe(
            map((res: any) => {
              return res.data;
            })
          )
    } else {
      return this.httpClient.put(environment.apiURL + this.path + '/dfrid/' + id, dfrActivityModel)
        .pipe(
            map((res: any) => {
              return res.data;
            })
          );
    }
  }

  public getDFRActByDfrId(id: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/dfrid/' + id)
      .pipe(
          map((res: any) => {
            return res.data;
          })
        );
  }

  public getDFRActByPkId(id: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/pkid/' + id)
      .pipe(
          map((res: any) => {
            return res.data;
          })
        );
  }

  public deleteDFRActByDfrId(id: string) {
    return this.httpClient.delete(environment.apiURL + this.path + '/dfrid/' + id);
  }

  public getDFRDisposalSummary(projectNumber: string, dfrDate: string) {
    this.httpClient.get(environment.apiURL + this.path + '/projectnumber/' + projectNumber + '/dfrdate/' + dfrDate + '/disposal')
      .pipe(
        map((res: any) => {
          return res.data;
        })
      )
      .subscribe(val => {
        this.dfrProjectDisposalSummaryList = val;
        this.dfrProjectDisposalSummaryList$.next(val);
    });
  }

  public getDFRCrossingSummary(projectNumber: string, dfrDate: string) {
    this.httpClient.get(environment.apiURL + this.path + '/projectnumber/' + projectNumber + '/dfrdate/' + dfrDate + '/crossing')
    .pipe(
      map((res: any) => {
        return res.data;
      })
    )
    .subscribe(val => {
      this.dfrCrossingSummaryList = val;
      this.dfrCrossingSummaryList$.next(val);
    });
  }


  public getTotalRigSummaryForType(disposalMethod: string) {
    let rigTotal = 0;
    this.dfrProjectDisposalSummaryList.forEach(val => {
      if (val.disposalMethod === disposalMethod ) {
          rigTotal = Number(rigTotal) + Number(val.dailyVolume);
      }
    });
    return rigTotal;
  }

  public getTotalRigSummaryForAll() {
    let rigTotal = 0;
    this.dfrProjectDisposalSummaryList.forEach(val => {
        rigTotal = Number(rigTotal) + Number(val.dailyVolume);
    });
    return rigTotal;
  }

  public getTotalCrossingSummaryForType(crossingLocation: string) {
    let crossingTotal = 0;
    this.dfrCrossingSummaryList.forEach(val => {
      if (val.crossingLocation === crossingLocation ) {
          crossingTotal = Number(crossingTotal) + Number(val.totalCrossingVolume);
      }
    });
    return crossingTotal;
  }


}
