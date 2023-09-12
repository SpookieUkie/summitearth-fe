import { Injectable } from '@angular/core';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { Network } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { DFRPhotoService } from '../dfr/daily-summary/dfr-photo/dfr-photo.service';
import { LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheSaveDataService {

  status = null;
  handler;
  loaderElement;
  recordUpdated = false;

  constructor(
      public storage: Storage,
      private httpClient: HttpClient,
      private sharedService: SharedService,
      private loadingController: LoadingController) {
 
    this.getStatus();
    if (this.handler === undefined) {
      this.handler = Network.addListener('networkStatusChange', (status) => {
        console.log('Network status changed! ', status);
        const oldStatus = this.status;
        this.status = status;
        if (this.status !== null && this.status.connected && !oldStatus.connected && oldStatus !== null) {
          this.saveCachedData();
        }
        this.status = status;
        if (!this.status.connected) {
          this.sharedService.showNotification('Network connection has terminated.', 'danger', 5000);
        } else {
          try {
            this.loaderElement.dismiss();
          } catch (error) {
           
          }
        }
      });
    }
  }



  public async getStatus() {
    this.status = await Network.getStatus();
  }


  public async saveCachedData() {
    const items = [];
   
    this.recordUpdated = false;
     try {
      const loader = await this.loadingController.create({
        message: 'Processing Cached Requets. One Moment Please.',
          animated: true
        }).then(loaderElement => {
          this.loaderElement = loaderElement;

           this.loaderElement.present();

            this.getKeys().then((keys: any) => {
              console.log (keys);

              let i = 0;
              keys.forEach((key: string) => {
                if (key.indexOf('reqcache') !== -1) {
                  const req = this.get2(key).then((val: any) => {

                    //If photo or document is cached, change the saved request to formData to save the file
                    if (val.url.indexOf ('photo') !== -1) {
                      val.body = this.prepFormAsFormDataFromModel(val.body);
                    }

                    if (val.method === 'PUT') {
                      this.httpClient.put(val.url, val.body).subscribe((res: any) => {
                        console.log (res);
                        items.push(key);
                        this.remove (key);
                        i++;
                        this.recordUpdated = true;
                        this.checkLoaderElement(i, keys,  this.loaderElement);
                      });
                    } else if (val.method === 'POST') {
                      this.httpClient.post(val.url, val.body).subscribe((res: any) => {
                        console.log (res);
                        items.push(key);
                        this.remove (key);
                        i++;
                        this.recordUpdated = true;
                        this.checkLoaderElement(i, keys,  this.loaderElement);
                      });
                    }

                  });
                } else {
                 i++;
                 this.checkLoaderElement(i, keys,  this.loaderElement);
                }

              });
            });
          });
    } catch (error) {
      this.loaderElement.dismiss();
    }

  }

  
  private checkLoaderElement(i, keys, loaderElement) {

    if (i === keys.length ) {
      loaderElement.dismiss();
      if ( this.recordUpdated) {
        this.sharedService.showNotification('Please slide down from the top to refresh the window', 'success', 2500);
      }
    }
  }

  private prepFormAsFormDataFromModel(dfrPhotoModel) {
    let formData = new FormData();
    formData.append('image', dfrPhotoModel.image);
    formData.append('dfrId', dfrPhotoModel.dfrId);
    formData.append('dfrRigId', dfrPhotoModel.dfrRigId);
    formData.append('useGeoRef', dfrPhotoModel.useGeoRef);
    formData.append('photoComments', dfrPhotoModel.photoComments);
    formData.append('additionalGeoRefComments', dfrPhotoModel.additionalGeoRefComments);
    formData.append('coords',  dfrPhotoModel.coords);
    return formData;
  }

  public async setItem(key, value) {
    return await this.storage.set(key, value);
  }

  public async setStorageRequest2(request) {
    const cacheKey = 'reqcache-' + this.sharedService.generateId();
    return await this.storage.set(cacheKey, request);
  }

  public async setStorageRequest(request) {
    // Validate the record is not stored already, if so, replace it. Must check against the localId if the record is new or the _id if its an update.
    const keys = await this.getKeys();
    /*for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.indexOf('reqcache') !== -1) {
        const req = await this.get2(key);
        let reqVal;
        if (req.body.hasOwnProperty('id')) {
          reqVal = req.body.id;
        }
        if (req.body.hasOwnProperty('localId')) {
          reqVal = req.body.localId;
        }

        let requestVal;
        if (request.body.hasOwnProperty('id')) {
          requestVal = request.body.id;
        }
        if (request.body.hasOwnProperty('localId')) {
          requestVal = request.body.localId;
        }

        if (reqVal === requestVal) {
          await this.remove(key);
        }
      }
    }*/

    this.sharedService.showNotification('User is offline. Service Request Cached', 'warning', 2000);
    const cacheKey = 'reqcache-' + this.sharedService.generateId() + '-' + request.urlWithParams;
    return await this.storage.set(cacheKey, request);
  }


  public async get(settingName) {
    return await this.storage.get(`setting:${ settingName }`);
  }

  public async get2(settingName) {
    return await this.storage.get(settingName);
  }

  public async remove(settingName){
    return await this.storage.remove(settingName);
  }

  public clear() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }

  public async getKeys() {
    return await this.storage.keys();
  }


}
