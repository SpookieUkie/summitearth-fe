import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { SharedService } from 'src/app/shared/shared.service';
import { GenericPhotoModel } from './genericphoto.model';


@Injectable({
  providedIn: 'root'
})
export class GenericPhotoService {
  constructor(private router: Router,
      private httpClient: HttpClient,
      private cacheSaveDataService: CacheSaveDataService,
      private sharedService: SharedService) {
  }

  public static readonly DailyAuditDWM = 'dailyauditdwm';

  private path = '/genericphoto';
  private currentPhoto = new BehaviorSubject<GenericPhotoModel>(null);
  private currentPhotoList = new BehaviorSubject<GenericPhotoModel[]>(null);


  public getCurrentPhoto() {
    return this.currentPhoto.asObservable();
  }

  public setCurrentPhoto(rigPhoto) {
    this.currentPhoto.next(rigPhoto);
  }

  public getCurrentPhotoList() {
    return this.currentPhotoList.asObservable();
  }

  public setCurrentPhotoList(photoList) {
    this.currentPhotoList.next(photoList);
  }

  public initPhoto(genericId, genericIdType) {
    const ph = new GenericPhotoModel();
    ph.genericId = genericId;
    ph.genericIdType = genericIdType;
    ph.useGeoRef = false;
    return ph;
  }

   // TODO: Ensure the user is still set to new DFR rig
  public resetSelectedDFRPhoto() {
    const dfrPhoto = new GenericPhotoModel();
    this.currentPhoto.next(dfrPhoto);
  }

  public buildHeader() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    //headers = headers.append('Authorization', 'Bearer ' + this.token );
    return headers;
  }

  public preparePhotoForSaving(formGroup: FormGroup, genericId, genericIdType, genericSubId, genericSubIdType, photoType) {
      formGroup.get('genericId').setValue(genericId);
      formGroup.get('genericIdType').setValue(genericIdType);
      formGroup.get('genericSubId').setValue(genericSubId);
      formGroup.get('genericSubIdType').setValue(genericSubIdType);
      formGroup.get('photoType').setValue(photoType);
      return formGroup;
  }

  public saveNewGenericPhoto(formGroup: FormGroup, coords: any) {
    if (!this.cacheSaveDataService.status.connected) {
      let formData2 = new GenericPhotoModel(null);
      formData2 = this.prepFormAsModel(formData2, formGroup, coords);
      return this.httpClient.post(environment.apiURL + this.path, formData2);
    } else {
      let formData2 = new FormData();
      formData2 = this.prepFormAsFormData(formData2, formGroup, coords);
      return this.httpClient.post(environment.apiURL + this.path, formData2);
    }
 }

  public updateGenericPhoto(formGroup: FormGroup, photoId: string, coords: any) {
      let formData = new FormData();
      formData = this.prepFormAsFormData(formData, formGroup, coords);
      return this.httpClient.put(environment.apiURL + this.path + '/photoid/' + photoId, formData);
  }

  // Used for saving online
  private prepFormAsFormData(formData, formGroup, coords) {
      formData.append('image', formGroup.get('image').value);
      formData.append('genericId', formGroup.get('genericId').value);
      formData.append('genericIdType', formGroup.get('genericIdType').value);
      formData.append('genericSubId', formGroup.get('genericSubId').value);
      formData.append('genericSubIdType', formGroup.get('genericSubIdType').value);
      formData.append('useGeoRef', formGroup.get('useGeoRef').value);
      formData.append('photoComments', formGroup.get('photoComments').value);
      formData.append('additionalGeoRefComments', formGroup.get('additionalGeoRefComments').value);
      formData.append('photoType', formGroup.get('photoType').value);
      formData.append('coords',  JSON.stringify(coords));
      return formData;
  }

  //Used for storing record offline
  private prepFormAsModel(formData, formGroup, coords) {
    formData.image = formGroup.get('image').value;
    formData.genericId =  formGroup.get('genericId').value;
    formData.genericIdType = formGroup.get('genericIdType').value;
    formData.genericSubId =  formGroup.get('genericSubId').value;
    formData.genericSubIdType = formGroup.get('genericSubIdType').value;
    formData.useGeoRef = formGroup.get('useGeoRef').value;
    formData.photoComments = formGroup.get('photoComments').value;
    formData.additionalGeoRefComments = formGroup.get('additionalGeoRefComments').value;
    formData.photoType = formGroup.get('photoType').value;
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

  public getGenericPhotoList(genericId: string, genericTypeId: string, photoType: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/genericid/' + genericId + '/genericidtype/' + genericTypeId + '/phototype/' + photoType)
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public getGenericPhotoListByPrimaryId(genericId: string, genericTypeId: string, base64encode: boolean) {
    return this.httpClient.get(environment.apiURL + this.path + '/genericid/' + genericId + '/genericidtype/' + genericTypeId + '/base64encode/' + base64encode)
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

  public deletePhoto(_id: string) {
    const temp: GenericPhotoModel[] = this.currentPhotoList.getValue();
    temp.forEach((item, index) => {
        if (item._id === _id) {
          temp.splice(index, 1);
        }
    });
    this.currentPhotoList.next(temp);
    if (_id !== null || _id !== undefined ) {
        return this.httpClient.delete(environment.apiURL + this.path + '/photoid/' + _id);
    }
  }

  public replacePhoto(file: GenericPhotoModel) {
    const temp: GenericPhotoModel[] = this.currentPhotoList.getValue();

    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id === undefined) {
        temp[i] = file;
        break;
      }
    }
    this.currentPhotoList.next(temp);
  }
}
