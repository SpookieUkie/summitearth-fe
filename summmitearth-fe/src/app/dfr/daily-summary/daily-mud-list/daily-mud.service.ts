import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { DailyMudModel } from '../daily-mud/daily-mud.model';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DailyMudFormModel } from '../daily-mud/daily-mud-form.model';
import { DailyMudListModel } from './daily-mud-list.model';
import { LoadingController } from '@ionic/angular';
import { DailyMudLocationModel } from '../daily-mud/daily-mud-location.model';

@Injectable({
  providedIn: 'root'
})
export class DailyMudService {

  private path = '/dfrmud';
  private path2 = '/projectNumber';
  
  private mudList = new BehaviorSubject<DailyMudModel[]>(null);

  private mudFormsSubject: BehaviorSubject<FormGroup | undefined> =
      new BehaviorSubject(this.formBuilder.group(new DailyMudListModel()));

  public mudFormsObs: Observable<FormGroup> = this.mudFormsSubject.asObservable();
  

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder )
    {}


    public getMudList() {
      return this.mudList.asObservable();
    }

    public setMudList(value: DailyMudModel[]) {
      this.mudList.next(value);
    }

    public clearFormSubject() {
      this.mudFormsSubject.next(this.formBuilder.group(new DailyMudListModel()));
    }

    public getDailyMudListForDFR(dfrId: string) {
      return this.httpClient.get(environment.apiURL +  this.path + '/dfrid/' + dfrId + '/mudlist/')
        .pipe(
          map((res: any) => {
            return res.data;
          })
        );
    }

    public addNewMud(dailyMud: DailyMudModel) {
        const data = JSON.parse(JSON.stringify(dailyMud));
        delete data._id;
        console.log (data);
        return this.httpClient.post(environment.apiURL + this.path, data);
    }

    public saveDailyMudList(dfrId: string, dailyMudList: DailyMudModel[]) {
        console.log(dailyMudList);
        return this.httpClient.put(environment.apiURL + this.path + '/dfrid/' + dfrId + '/mudlist/',  dailyMudList);
    }

    public deleteMud(id: string) {
        return this.httpClient.delete(environment.apiURL + this.path + '/id/' + id);
    }

    // TODO: Find a better way to hide the loader or put back to subscription
    public popuplateMudForms(dfrId: string, loader: HTMLIonLoadingElement) {
      this.httpClient.get(environment.apiURL +  this.path + '/dfrid/' + dfrId + '/mudlist/').subscribe(val => {
          const collection = val['data'];
          console.log (collection);
          console.log ('populate mud value');
          console.log (this.mudFormsSubject.getValue());
          const mudForms = this.mudFormsSubject.getValue();
          if (mudForms !== undefined) {
            const mudList = mudForms.get('mudList') as FormArray;
            for (const item of collection) {
               console.log (item);
                mudList.push(this.formBuilder.group(new DailyMudFormModel(item)));
            }
            this.mudFormsSubject.next(mudForms);
        }
          if (loader !== null && loader !== undefined) {
            loader.remove();
          }
      }, err => {
        loader.remove();
      });
    }

    public addMudForm(dfrid: string, locations: DailyMudLocationModel[]) {
      let mud = new DailyMudModel();
      mud.dfrId = dfrid;
      mud.locations = locations;
      this.addNewMud(mud).subscribe(val => {
        const mudForms = this.mudFormsSubject.getValue();
        const mudList = mudForms.get('mudList') as FormArray;
        mud = val['data'];
        mudList.push(this.formBuilder.group(new DailyMudFormModel(mud)));
        this.mudFormsSubject.next(mudForms);
      });
    }

    public addMudForm2(dfrid: string, localId: string, locations: DailyMudLocationModel[]) {
      const mud = new DailyMudModel();
      mud.dfrId = dfrid;
      mud.localId = localId;
      mud.locations = locations;

      const mudForms = this.mudFormsSubject.getValue();
      const mudList = mudForms.get('mudList') as FormArray;

      mudList.push(this.formBuilder.group(new DailyMudFormModel(mud)));
      this.mudFormsSubject.next(mudForms);
    }

    public removeMudForm(i: number) {
      const mudForms = this.mudFormsSubject.getValue();
      const mudList = mudForms.get('mudList') as FormArray;
      mudList.removeAt(i);
      this.mudFormsSubject.next(mudForms);
    }

    public getCalculatedMudByProjectCode(dfrid: string) {
      return this.httpClient.get(environment.apiURL +  this.path + '/dfrid/' + dfrid + '/mudsummary/')
        .pipe(
          map((res: any) => {
            return res.data;
          })
        );
    }
  }

