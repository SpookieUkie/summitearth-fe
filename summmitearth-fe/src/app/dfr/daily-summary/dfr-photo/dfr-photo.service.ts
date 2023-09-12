import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { DfrPhotoModel } from './dfr-photo.model';
import { FormGroup } from '@angular/forms';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { SharedService } from 'src/app/shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class DFRPhotoService {
  constructor(private router: Router,
      private httpClient: HttpClient,
      private cacheSaveDataService: CacheSaveDataService,
      private sharedService: SharedService) {
  }

  private path = '/dfrphoto';
  private currentRigPhoto = new BehaviorSubject<DfrPhotoModel>(null);
  private currentRigPhotoList = new BehaviorSubject<DfrPhotoModel[]>(null);

  public getCurrentRigPhoto() {
    return this.currentRigPhoto.asObservable();
  }

  public setCurrentRigPhoto(rigPhoto) {
    this.currentRigPhoto.next(rigPhoto);
  }

  public getCurrentPhotoList() {
    return this.currentRigPhotoList.asObservable();
  }

  public setCurrentRigPhotoList(rigPhotoList) {
    this.currentRigPhotoList.next(rigPhotoList);
  }

   // TODO: Ensure the user is still set to new DFR rig
  public resetSelectedDFRPhoto() {
    const dfrPhoto = new DfrPhotoModel(null, null, null, null, null, null, null, null, false, null, null);
    this.currentRigPhoto.next(dfrPhoto);
  }

  public buildHeader() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    //headers = headers.append('Authorization', 'Bearer ' + this.token );
    return headers;
  }

  public saveNewRigPhoto(formGroup: FormGroup, coords: any) {
    if (!this.cacheSaveDataService.status.connected) {
      let formData2 = new DfrPhotoModel(null);
      formData2 = this.prepFormAsModel(formData2, formGroup, coords);
      return this.httpClient.post(environment.apiURL + this.path, formData2);
    } else {
      let formData2 = new FormData();
      formData2 = this.prepFormAsFormData(formData2, formGroup, coords);
      return this.httpClient.post(environment.apiURL + this.path, formData2);
    }
 }

  public updateRigPhoto(formGroup: FormGroup, rigPhotoId: string, coords: any) {
      let formData = new FormData();
      formData = this.prepFormAsFormData(formData, formGroup, coords);
      return this.httpClient.put(environment.apiURL + this.path + '/rigphotoid/' + rigPhotoId, formData);
  }

  // Used for saving online
  private prepFormAsFormData(formData, formGroup, coords) {
      formData.append('image', formGroup.get('image').value);
      formData.append('dfrId', formGroup.get('dfrId').value);
      formData.append('dfrRigId', formGroup.get('dfrRigId').value);
      formData.append('useGeoRef', formGroup.get('useGeoRef').value);
      formData.append('photoComments', formGroup.get('photoComments').value);
      formData.append('additionalGeoRefComments', formGroup.get('additionalGeoRefComments').value);
      formData.append('coords',  JSON.stringify(coords));
      return formData;
  }

  //Used for storing record offline
  private prepFormAsModel(formData, formGroup, coords) {
    formData.image = formGroup.get('image').value;
    formData.dfrId =  formGroup.get('dfrId').value;
    formData.dfrRigId = formGroup.get('dfrRigId').value;
    formData.useGeoRef = formGroup.get('useGeoRef').value;
    formData.photoComments = formGroup.get('photoComments').value;
    formData.additionalGeoRefComments = formGroup.get('additionalGeoRefComments').value;
    formData.coords  =  JSON.stringify(coords);
    return formData;
  }

  private base64String(imageData) {
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      return dataUrl;
    };
    fr.readAsDataURL(imageData);
  }

  public getDFRPhotoList(rigId: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/rigId/' + rigId)
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public getDFRPhotoListByDfrId(dfrId: string, base64encode: boolean) {
    return this.httpClient.get(environment.apiURL + this.path + '/dfrId/' + dfrId + '/base64encode/' + base64encode)
     .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public getLogoAsBase64() {
    return this.httpClient.get(environment.apiURL + this.path + '/summitlogo/')
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public deletePhoto(rigPhotoId: string) {
    const temp: DfrPhotoModel[] = this.currentRigPhotoList.getValue();
    temp.forEach((item, index) => {
        if (item._id === rigPhotoId ||  item._id === rigPhotoId) {
          temp.splice(index, 1);
        }
    });
    this.currentRigPhotoList.next(temp);
    if (rigPhotoId !== null || rigPhotoId !== undefined ) {
        return this.httpClient.delete(environment.apiURL + this.path + '/rigPhotoId/' + rigPhotoId);
    }
  }
}
