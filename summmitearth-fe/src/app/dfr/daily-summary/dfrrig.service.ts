import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { DfrDailyRigModel } from './daily-rig/daily-rig.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DfrDailyDisposalModel } from './daily-rig/daily-disposal.model';
import { SharedService } from 'src/app/shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class DfrRigService {
  constructor(
      private router: Router,
      private httpClient: HttpClient,
      private formBuilder: FormBuilder,
      private sharedService: SharedService) {
  }

  private path = '/dfrrig';

  private currentDFRRig$ = new BehaviorSubject<DfrDailyRigModel>(null);

  private currentDFRRigSub: BehaviorSubject<FormGroup | undefined> =
  new BehaviorSubject(this.formBuilder.group(new DfrDailyRigModel()));

  private dfrRigList = new Array<DfrDailyRigModel>();

  private dfrRigList$: BehaviorSubject<DfrDailyRigModel[] | undefined> 
        = new BehaviorSubject(new Array<DfrDailyRigModel>());

  public dfrRigListObs = this.dfrRigList$.asObservable();

  public getCurrentDFRRig() {
    return this.currentDFRRig$.asObservable();
  }

  public setCurrentDFRRig(dfrRig) {
    this.currentDFRRig$.next(dfrRig);
  }

   // TODO: Ensure the user is still set to new DFR rig
  public resetSelectedDFRRig() {
    const disposalModel = new DfrDailyDisposalModel(null, '', '', 0);
    const dfrRig = new DfrDailyRigModel(null, null, null, null,  null, null, null, null,  null, null, null, null, 
                     null, null, null, null,  null, [disposalModel], []);
        
    this.currentDFRRig$.next(dfrRig);

  }

  public prepForCopy(dfrRigModel: DfrDailyRigModel) {
    dfrRigModel._id = null;
  }

  public buildHeader() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return headers;
  }

  // Must convert model to json and delete _id from saving new, otherwise the id will not come back, eventhough the record will save!!!!
  public saveDFRRig(dfrRigModel: DfrDailyRigModel) {
    if (dfrRigModel == null || dfrRigModel._id === undefined || dfrRigModel._id === null) {
      const data = JSON.parse(JSON.stringify(dfrRigModel));
      delete data._id;
      return this.httpClient.post(environment.apiURL + this.path, data)
      .pipe(
          map((res: any) => {
            return res.data;
          })
        );
    } else {
      return this.httpClient.put(environment.apiURL + this.path + '/dfrrigid/' + dfrRigModel._id, dfrRigModel)
      .pipe(
          map((res: any) => {
            return res.data;
          })
        );
    }
  }

  public getDFRRigList2(dfrId: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/dfrid/' + dfrId)
    .pipe(
          map((res: any) => {
            return res.data;
          })
        );
    
  }

  public getDFRRigList(dfrId: string) {
    if (!this.dfrRigList$) {
       this.dfrRigList$ = new BehaviorSubject(new Array<DfrDailyRigModel>());
    }

    this.httpClient.get(environment.apiURL + this.path + '/dfrid/' + dfrId).pipe (
      )
      .pipe(
          map((res: any) => {
            return res.data;
          })
        )
        .subscribe(val => {
        this.dfrRigList = val;
        this.dfrRigList$.next(val);
        console.log('Got Rig Data');
      },
      error => console.log ('Error getting DFR Rig List'));
  }

  private catchError() {
    console.log('Error');
  }

  public getDFRRig(dfrRigId: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/dfrrigid/' + dfrRigId)
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public deleteDFRRig(id: string) {
    return this.httpClient.delete(environment.apiURL + this.path + '/dfrrigid/' + id);
  }

  public getDailyRigSummaryForType(disposalMethod: string) {
    let rigTotal = 0;
    this.dfrRigList.forEach(val => {
      val.disposalAreas.forEach(val2 => {
        if (val2.disposalMethod === disposalMethod ) {
          rigTotal = Number(rigTotal) + Number(val2.dailyVolume);
        }
      });
      
    });
    return rigTotal;
  }


}
