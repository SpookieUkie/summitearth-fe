import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, AlertController, Platform, MenuController, IonMenu, IonInput } from '@ionic/angular';
import { environment } from './../../environments/environment';
import { Form, FormGroup, ValidationErrors, FormArray } from '@angular/forms';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { Plugins, MotionOrientationEventResult, FilesystemEncoding } from '@capacitor/core';
const { Motion } = Plugins;
import {  FilesystemDirectory  } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

import { File } from '@ionic-native/file';
import { GenericFileModel } from './genericfile/genericfile.model';
const { Filesystem } = Plugins;
import { FilesystemPluginWeb } from '@capacitor/core/dist/esm/web/filesystem.js';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private router: Router,
    private httpClient: HttpClient,
    private toastController: ToastController,
    private alertController: AlertController,
    private platform: Platform,
    private menuController: MenuController,
    private fileOpener: FileOpener
     ) {
      
}

  private path = '/upload';
  private list = new BehaviorSubject<any>(null);
  public orientation;

  public async openZip(blob: any) {
    const filename = 'Files_' + this.generateId() + '.zip';

    File.writeFile(File.dataDirectory, filename, blob).then(val => {
      console.log ('done file');
      console.log (val);
      try {
        this.fileOpener.open(val.nativeURL, 'application/zip')
                .then(() => console.log('File is opened'))
                .catch(error => console.log('Error openening file', error));

      } catch (error) {
          console.error('Unable to read file', error);
      }
    }), (error) => {
      console.log ('error writing file')
      console.log (error);
    };
  }

  public getFile(val) {
    Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: val
    }).then((getUriResult) => {
      console.error('got uri ' + getUriResult.uri);
      const path = getUriResult.uri;
      this.fileOpener.open(path, 'application/zip');
    }, (error) => {
      console.log(error);
    });
  }


  public writeFile(data: string) {
    try {
      Filesystem.writeFile({path: 'Files.zip', data: data,  directory: FilesystemDirectory.Documents});
    } catch (error) {
      console.error('Unable to write file', error);
    }
  }

  public isMobileDevice() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      return true;
    }
    return false;
  }

  public getOS() {
    if (this.platform.is('ios') ) {
      return 'ios';
    } else if (this.platform.is('android')) {
      return 'android';
    } else {
      return 'web';
    }
  }

   public  getPlaformWidth() {
    return this.platform.width();
  }

  public isCellPhone() {
    if (this.platform.is('iphone') || this.platform.is('android')) {
      return true;
    }
    return false;
  }

  public uploadPhoto(image: File) {
      const imageData = new FormData();
      imageData.append('image', image);
      // See all values in the object
      imageData.forEach((value, key) => {
        console.log('key %s: value %s', key, value);
      });
      return this.httpClient.post(environment.apiURL + this.path, imageData);
  }

  // For some reason, does not work within service.
  public imageToString(imageData) {
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      return dataUrl;
    };
    fr.readAsDataURL(imageData);
  }

  // Don't work in service
  public updateForm(form: FormGroup, model: any) {
    for (const i in form.controls) {
      form.get(i).setValue(model[i]);
     }
     return form;
  }
  /*

    for (let key2 in k.controls) {
              k.get(key2).markAsDirty();
              k.get(key2).markAsTouched();
              k.markAsDirty();
              k.markAsTouched();
            });

            */
  public setFormDate(model: any, fc: FormGroup, field: string, dateField: IonInput, useLongerDelay: boolean = false) {
    if (model[field] !== undefined && dateField !== undefined) {
      if (!useLongerDelay) {
        const val = model[field].toString();
        fc.get(field).setValue(model[field]);
          setTimeout(() => {
            dateField.value = val.substring(0, 10);
          }, 5);
      } else { 
        setTimeout(() => {
          if (model[field] !== undefined && dateField !== undefined) {
            let val = model[field].toString();
            fc.get(field).setValue(model[field]);
              setTimeout(() => {
                dateField.value = val.substring(0, 10);
              }, 5);
          }
        }, 100);
      }
    }

    
  }

  public invalidateForm(form: FormGroup, forceValidate) {
    if (forceValidate) {
      Object.keys(form.controls).forEach(key => {
        if (form.get(key) instanceof FormArray) {
            const p = form.get(key) as FormArray;
            const r = p.controls[0] as FormGroup;
            const k = r.controls;
            // tslint:disable-next-line: forin
            for (const key2 in k) {
              k[key2].markAsDirty();
              k[key2].markAsTouched();
             // k[key2].markAsDirty();
              //k[key2].markAsTouched();
            };
        } else {
          form.get(key).markAsDirty();
          form.get(key).markAsTouched();
          form.markAsDirty();
          form.markAsTouched();
        }
      });
    } else {
       Object.keys(form.controls).forEach(key => {
        if (form.get(key) instanceof FormArray) {
            const p = form.get(key) as FormArray;
            const r = p.controls[0] as FormGroup;
            const k = r.controls;
            // tslint:disable-next-line: forin
            for (const key2 in k) {
              k[key2].markAsPristine();
              k[key2].markAsUntouched();
              //k[key2].markAsPristine();
             // k[key2].markAsUntouched();
            };
        } else {
            form.get(key).markAsPristine();
            form.get(key).markAsUntouched();
            form.markAsPristine();
            form.markAsUntouched();
       
        }
    });
  }
}


  public getInvalidFormsFields(form: FormGroup) {
      Object.keys(form.controls).forEach(key => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
  }



  public updateFormSkipId(form: FormGroup, model: any) {
    for (const i in form.controls) {
      if (i !== '_id') {
        form.get(i).setValue(model[i]);
      }
     }
     return form;
  }

  public async showNotification(message: string, color: string = 'dark', duration: number = 1250) {
    const toast = await this.toastController.create({
      message: message,
      position: 'top',
      duration: duration,
      color: color,
      closeButtonText: 'Dismiss',
    }).then(toastElement => {
      toastElement.present();
    });
  }

 // Will get current and forcast weather
  public getForecastWeather(location: string) {
    //const apiURL = 'https://api.apixu.com/v1/forecast.json?key=b007ecab9e744f66b73135548191406&q=';
    //https://dfrapp.summitearth.com/weather.php?location=';'
    const apiURL = 'https://dwm.summitearth.com/summit_io/proxy/weather.php?location=';
    if (location.indexOf(',') !== -1) {
      const locations = location.split(',');
      location = locations[0];
    }
    return this.httpClient.get(apiURL + location);
  }

  public trackUser(userId, userType, key) {
    let headers: HttpHeaders = new HttpHeaders({});
     headers.append('Content-Type','application/x-www-form-urlencoded');
     headers.append('Content-Type','application/json');
    const url = environment.seMapApiURL + userId + '&user_type=' + userType + '&key_id=' + key;
    
    //const url = 'http://mapsv4:8888/maps/services/request_handler.php?request_type=track_user&job_id=0&land_uid=0';
    return this.httpClient.get(url, {headers}); // post does not work
  }

  public filterList(dateToCompare, list) {
    let filteredLocations = [];
      list.forEach(em => {
        const startDate = moment(em.startDate).startOf('day').toDate();
        let endDate = null;
        if (em.endDate !== null) {
          endDate = moment(em.endDate).endOf('day').toDate();
        }

        if (startDate === null && endDate === null) {
          filteredLocations.push(em);
        } else if (startDate <= dateToCompare && (endDate >= dateToCompare || endDate === null)) {
          filteredLocations.push(em);
        }
      });
    return filteredLocations;
  }

  public async showAlert(message: string, title: string = 'Error Saving Record') {
    const alert = await this.alertController.create({
      message: message,
      header: title,
      buttons: ['OK']
    }).then(alertElement => {
      alertElement.present();
    });
  }

  public  formatDate (date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  public base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = window.atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    //console.log(byteArrays);
    return new Blob(byteArrays, { type: contentType });
  }

  public dataURLToBlob(dataURL) {
    // Code taken from https://github.com/ebidel/filer.js
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }

  public blobToBase64(blob) {
    const reader = new FileReader();
   
    reader.onloadend = function() {
      console.log ('on load end')
      const base64data = reader.result.toString();
      console.log(base64data);
      return base64data;
    }
    console.log ('on load start')
    reader.readAsDataURL(blob);
    
  }



  public generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
  }

  public resetTime(val) {
    val.setUTCHours(12);
    val.setUTCMinutes(0);
    val.setUTCSeconds(0);
    return val;
  }


  openOnDevice(genericFile: GenericFileModel) {
    const ft = FileTransfer.create();
    try {
      let fileURL = genericFile.fileUrl;
      fileURL = fileURL.replace('\\', '/');
      fileURL = fileURL.replace('\\\\', '/');
      fileURL = fileURL.replace('\\', '/');
      fileURL = fileURL.replace('\\', '/');
      fileURL = fileURL.replace('\\', '/');
      console.log ('fileURL');
      console.log (fileURL);
      ft.download(fileURL, File.dataDirectory + Math.random().toString() + '_' + genericFile.originalFileName).then((writeFileResult) => {
        console.error('file downlaoded');
        this.fileOpener.open(writeFileResult.toURL(), genericFile.mimeType)
              .then(() => console.log('File is opened'))
              .catch(error => console.log('Error openening file', error));
        }, (error) => {
            console.log('Error opening file');
            console.log(error);
        });

    } catch (error) {
      console.error('Unable to read file', error);
    }

    
  }

  


  public openReportOnDevice(filePath: string, fileName: string) {
    const ft = FileTransfer.create();
    try {
      ft.download(filePath, File.dataDirectory + fileName).then((writeFileResult) => {

        this.fileOpener.open(writeFileResult.toURL(), 'application/vnd.ms-excel')
              .then(() => console.log('File is opened'))
              .catch(error => console.log('Error openening file', error));
        }, (error) => {
            console.log(error);
        });

    } catch (error) {
      console.error('Unable to read file', error);
    }
  }



  public getCurrentAngle() {
    Motion.addListener('orientation', (event: MotionOrientationEventResult) => {
      console.log ('Orientation');
      console.log (event);
      const orientation: any = {};
      orientation.alpha = event.alpha;
      orientation.beta = event.beta;
      orientation.gamma = event.gamma;
      orientation.degrees = this.compassHeading(event.alpha, event.beta, event.gamma);
      orientation.direction = this.degToCompass(orientation.degrees);
      this.orientation = orientation;
      console.log (this.orientation);
      console.log (this.orientation.degrees.toFixed(9))
     
    });
  }


  public compassHeading(alpha, beta, gamma) {

    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);
  
    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var cB = Math.cos(betaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);
  
    // Calculate A, B, C rotation components
    var rA = - cA * sG - sA * sB * cG;
    var rB = - sA * sG + cA * sB * cG;
    var rC = - cB * cG;
  
    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);
  
    // Convert from half unit circle to whole unit circle
    if(rB < 0) {
      compassHeading += Math.PI;
    }else if(rA < 0) {
      compassHeading += 2 * Math.PI;
    }
    
    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    console.log (' compassHeading aft ');
    console.log (compassHeading);
  
    return compassHeading;
  
  }

  public  degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  }

 

}
