import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { environment } from './../../environments/environment';
import { Form, FormGroup } from '@angular/forms';
import { map, filter, first } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MudProductModel } from '../admin/mudmanagement/mudProduct.model';

@Injectable({
  providedIn: 'root'
})
export class StaticlistService {

  constructor (private httpClient: HttpClient) {
  }

  private currentActivityList = new BehaviorSubject<any>(null);
  private sprayFieldConditionsList = new BehaviorSubject<any>(null);
  private disposalMethodList = new BehaviorSubject<any>(null);
  private mudProductsList = new BehaviorSubject<any>(null);
  private provinceList = new BehaviorSubject<any>(null);
  private cementStorageTypeList = new BehaviorSubject<any>(null);
  private wellTypeList = new BehaviorSubject<any>(null);
  private timeOfInspectionList = new BehaviorSubject<any>(null);
  private seasonList = new BehaviorSubject<any>(null);
  public rrrList = new BehaviorSubject<any>(null);
  public anyList = new BehaviorSubject<any>(null);

  public GROUND_CONDITION = 'groundCondition';

  public getListCollection2(group: string) {
    return this.httpClient.get(environment.apiURL +  '/staticlists/group/' + group)
    .pipe(map ( (res: any)   => {
      if (group === 'rrr') {
        this.rrrList.next(res.data);
      } else if (group === 'any') {
        this.anyList.next(res.data);
      }
    }))
    //sub.unsubscribe();
}

  public getListCollection(group: string) {
      const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/group/' + group)
      .pipe(map ( (res: any)   => {
        if (group === 'rrr') {
          this.rrrList.next(res.data);
        } else if (group === 'any') {
          this.anyList.next(res.data);
        }
      })).subscribe();
      //sub.unsubscribe();
  }

  public getListTypeForRRR(type: String) {
    if (this.rrrList.value === undefined || this.rrrList.value == null) {
      this.getListCollection('rrr');
    }
    return this.rrrList.pipe(
      map(items => items.filter(val => val.type === type)),
    );
  }


  public getListTypeForAny(type: String) {
    if (this.anyList.value === undefined || this.anyList.value == null) {
      this.getListCollection('any');
    }
    return this.anyList.pipe(
      map(items => items.filter(val => val.type === type))
    );
  }


  public getCurrentyActivity(group: string) {
      const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/type/currentActivity/group/' + group)
      .pipe(map ( (res: any)  => {
        this.currentActivityList.next(res.data);
        console.log(this.currentActivityList.value);
      })).subscribe();
      //sub.unsubscribe();
  }

  public getSprayFieldCondition(group: string) {
    const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/type/sprayFieldCondition/group/' + group)
    .pipe(map ( (res: any)  => {
      console.log(res);
      this.sprayFieldConditionsList.next(res.data);
      console.log(this.sprayFieldConditionsList);
    })).subscribe();
    //sub.unsubscribe();
  }

  public getDisposalMethod(group: string) {
    const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/type/disposalMethod/group/' + group)
    .pipe(map ( (res: any) => {
      this.disposalMethodList.next(res.data);
      console.log(this.disposalMethodList.value);
    })).subscribe();
    //sub.unsubscribe();
  }

  public getMudProducts() {
    const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/type/mudproducts')
    .pipe(map ( (res: any) => {
      this.mudProductsList.next(res.data);
    })).subscribe();
    //sub.unsubscribe();
  }

  public getCementStorageTypes(group: string) {
    const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/type/cementStorageType/group/' + group)
    .pipe(map ( (res: any) => {
      this.cementStorageTypeList.next(res.data);
    })).subscribe();
    //sub.unsubscribe();
  }

  public getProvinces(group: String) {
    const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/type/province/group/' + group)
    .pipe(map ( (res: any) => {
      this.provinceList.next(res.data);
    })).subscribe();
    //sub.unsubscribe();
  }

  public getWellTypes(group: String) {
    const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/type/wellType/group/' + group)
    .pipe(map ( (res: any) => {
      this.wellTypeList.next(res.data);
    })).subscribe();
    //sub.unsubscribe();
  }

  public getSeasons(group: String) {
    const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/type/season/group/' + group)
    .pipe(map ( (res: any) => {
      this.seasonList.next(res.data);
    })).subscribe();
    //sub.unsubscribe();
  }

  public getTimeOfInspections(group: String) {
    const sub: Subscription = this.httpClient.get(environment.apiURL +  '/staticlists/type/timeOfInspection/group/' + group)
    .pipe(map ( (res: any) => {
      this.timeOfInspectionList.next(res.data);
    })).subscribe();
    //sub.unsubscribe();
  }

  public getCurrentActivityList(group: string) {
    if (this.currentActivityList.value === undefined || this.currentActivityList.value == null) {
      this.getCurrentyActivity(group);
    }
    return this.currentActivityList.asObservable();
  }

  public getSprayFieldConditionList(group: string) {
    if (this.sprayFieldConditionsList.value === undefined || this.sprayFieldConditionsList.value == null) {
      this.getSprayFieldCondition(group);
    }
    return this.sprayFieldConditionsList.asObservable();
  }

  public getDisposalMethodList(group: string) {
    if (this.disposalMethodList.value === undefined || this.disposalMethodList.value == null) {
      this.getDisposalMethod(group);
    }
    return this.disposalMethodList.asObservable();
  }

  public getMudProductsList(forceRefresh = false) {
    if (this.mudProductsList.value === undefined || this.mudProductsList.value == null || forceRefresh) {
      this.getMudProducts();
    }
    return this.mudProductsList.asObservable();
  }

  public getSingleMudProduct(mudProductId) {
    return this.mudProductsList.pipe(
        map(mudList => mudList.filter(mud => mud._id === mudProductId)[0]),
    );
  }

  public getMudProductByNameAndId(mudProductName) {
    return this.mudProductsList.pipe(
        map(mudList => mudList.filter(mud => mud.mudProductName === mudProductName)),
    );
  }

  public addMudProduct(mud: MudProductModel) {
    delete mud._id;
    mud.isDisabled = false;
    return this.httpClient.post(environment.apiURL + '/staticlists/type/mudproducts/add', mud)
    .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public updateMudProduct(mud: MudProductModel) {
    return this.httpClient.put(environment.apiURL + '/staticlists/type/mudproducts/update/id/' + mud._id, mud)
    .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public isMudListNull() {
    return this.mudProductsList.value === null;
  }


  public getProvinceList(group: string) {
    if (this.provinceList.value === undefined || this.provinceList.value == null) {
      this.getProvinces(group);
    }
    return this.provinceList.asObservable();
  }

  public getCementStorageTypeList(group: string) {
    if (this.cementStorageTypeList.value === undefined || this.cementStorageTypeList.value == null) {
      this.getCementStorageTypes(group);
    }
    return this.cementStorageTypeList.asObservable();
  }

  public getWellTypeList(group: string) {
    if (this.wellTypeList.value === undefined || this.wellTypeList.value == null) {
      this.getWellTypes(group);
    }
    return this.wellTypeList.asObservable();
  }

  public getTimeOfInspectionList(group: string) {
    if (this.timeOfInspectionList.value === undefined || this.timeOfInspectionList.value == null) {
      this.getTimeOfInspections(group);
    }
    return this.timeOfInspectionList.asObservable();
  }

  public getSeasonList(group: string) {
    if (this.seasonList.value === undefined || this.seasonList.value == null) {
      this.getSeasons(group);
    }
    return this.seasonList.asObservable();
  }

  public getDailyAuditDWMLists() {
    this.getProvinceList('dwm');
    this.getCementStorageTypeList('dwm');
    this.getWellTypeList('dwm');
    this.getTimeOfInspectionList('dwm');
    this.getSeasonList('dwm');
  }


}
