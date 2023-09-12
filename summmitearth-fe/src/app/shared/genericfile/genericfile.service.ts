import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, AlertController, Platform, MenuController, IonMenu, IonImg, LoadingController } from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { map, flatMap } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { GenericFileModel } from './genericfile.model';
import { FormGroup } from '@angular/forms';
import { CacheSaveDataService } from '../../auth/cache-save-data.service';
import { FileTransferObject, FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { SharedService } from '../shared.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';





@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private path = '/genericfile';
  private downloadpath = '/genericfile/downloadfiles';
  private currentFile = new BehaviorSubject<GenericFileModel>(null);
  private currentFileList = new BehaviorSubject<GenericFileModel[]>(null);
  
  constructor(private router: Router,
    private httpClient: HttpClient,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform,
    private menuController: MenuController,
    private cacheSaveDataService: CacheSaveDataService,
    //private transfer: FileTransfer,
    private fileOpener: FileOpener,
    private sharedService: SharedService,
    private file: File) {

   }


  public createDailyFieldTicket(ids: string) {
    return this.httpClient.get(environment.apiURL +  '/excel/fieldticket/' + ids);
  }

  public createExcelDFR(ids: string) {
    return this.httpClient.get(environment.apiURL +  '/dfrexcel/dfrexcel/' + ids);
  }

  public getCurrentFile() {
    return this.currentFile.asObservable();
  }

  public setCurrentFile(file) {
    this.currentFile.next(file);
  }

  public getCurrentFileList() {
    return this.currentFileList.asObservable();
  }

  public setCurrentFileList(fileList) {
    this.currentFileList.next(fileList);
  }


  public saveNewGenericFile(formGroup: FormGroup) {
    if (!this.cacheSaveDataService.status.connected) {
      let formData2 = new GenericFileModel(null);
      formData2 = this.prepFormAsModel(formData2, formGroup);
      return this.httpClient.post(environment.apiURL + this.path, formData2);
    } else {
      let formData2 = new FormData();
      formData2 = this.prepFormAsFormData(formData2, formGroup);
      return this.httpClient.post(environment.apiURL + this.path, formData2);
    }
 }

 public async saveNewGenericFileIOS(formGroup: FormGroup, file) {
    /*const fileTransfer: FileTransferObject = this.transfer.create();
    console.log('Upload File IOS');
    if (!this.cacheSaveDataService.status.connected) {
      let formData2 = new GenericFileModel(null);
      formData2 = this.prepFormAsModel(formData2, formGroup);
      console.log(formData2);
      fileTransfer.upload(file, environment.apiURL + this.path, formData2).then((data : any) => {
        console.log(data.data);
        console.log('Uploaded Cached');
        this.currentFileList.value.push(data);
        this.sharedService.showNotification('File Added to Report');
        formGroup.markAsPristine();
        return data;
      }, (err) => {
        console.log(err);
      });

    } else {
      console.log(' Save Data');
      let formData2 = new FormData();
      formData2 = this.prepFormAsModel(formData2, formGroup, true);
     // console.log (file)
      const uploadOpts: FileUploadOptions = {
        fileKey: 'file',
        fileName: formGroup.get('originalFileName').value,
        mimeType: formGroup.get('mimeType').value,
        params: formData2
      };
     // console.log(uploadOpts);

       const lc = await this.loadingController.create({
        message: 'Uploading File. One Moment',
        spinner: 'dots'
      });

      await lc.present();

      await fileTransfer.upload(file, environment.apiURL + this.path, uploadOpts).then((data) => {
        console.log('Data');
        console.log(data.response);
        console.log('Uploaded to Server');
        const newVal = JSON.parse(data.response);
        console.log(newVal.data);
        file = newVal.data;
        this.sharedService.showNotification('File Added to Report');
        formGroup.markAsPristine();
        lc.dismiss();
        console.log('Return Data');
        this.replaceFile(newVal.data);
        return newVal.data;
      }, (err) => {
        console.log(err);
      });
    } */
 }



 public updateGenericFile(formGroup: FormGroup, fileId: string) {
    let formData = new FormData();
    formData = this.prepFormAsFormData(formData, formGroup);
    return this.httpClient.put(environment.apiURL + this.path + '/fileid/' + fileId, formData);
 }

  public initFile(genericId, genericIdType) {
      const file = new GenericFileModel();
      file.genericId = genericId;
      file.genericIdType = genericIdType;
      return file;
  }

  public prepareFileForSaving(formGroup: FormGroup, genericId, genericIdType, genericSubId, genericSubIdType) {
    formGroup.get('genericId').setValue(genericId);
    formGroup.get('genericIdType').setValue(genericIdType);
    formGroup.get('genericSubId').setValue(genericSubId);
    formGroup.get('genericSubIdType').setValue(genericSubIdType);
    formGroup.get('fileUrl').setValue('');
    return formGroup;
  }

    // Used for saving online
    private prepFormAsFormData(formData, formGroup) {
      formData.append('file', formGroup.get('file').value);
      formData.append('genericId', formGroup.get('genericId').value);
      formData.append('genericIdType', formGroup.get('genericIdType').value);
      formData.append('genericSubId', formGroup.get('genericSubId').value);
      formData.append('genericSubIdType', formGroup.get('genericSubIdType').value);
      formData.append('fileComments', formGroup.get('fileComments').value);
      formData.append('fileName', formGroup.get('fileName').value);
      formData.append('mimeType', formGroup.get('mimeType').value);
      formData.append('fileSize', formGroup.get('fileSize').value);
      formData.append('fileUrl', formGroup.get('fileUrl').value);
      formData.append('originalFileName', formGroup.get('originalFileName').value);
      formData.append('displayName', formGroup.get('displayName').value);
      return formData;
  }

  //Used for storing record offline
  private prepFormAsModel(formData, formGroup, skipFile: boolean = false) {
      if (!skipFile) {
        formData.file = formGroup.get('file').value;
      }
      formData.genericId =  formGroup.get('genericId').value;
      formData.genericIdType = formGroup.get('genericIdType').value;
      formData.genericSubId =  this.formatValue(formGroup.get('genericSubId').value);
      formData.genericSubIdType = this.formatValue(formGroup.get('genericSubIdType').value);
      formData.fileComments = formGroup.get('fileComments').value;
      formData.fileName = formGroup.get('fileName').value;
      formData.mimeType = formGroup.get('mimeType').value;
      formData.fileSize = formGroup.get('fileSize').value;
      formData.fileUrl = formGroup.get('fileUrl').value;
      formData.originalFileName = formGroup.get('originalFileName').value;
      formData.displayName = formGroup.get('displayName').value;
      return formData;
  }

  private formatValue(val) {
    if (val === null || val === undefined || val === 'null' || val === 'undefined') {
      return '';
    }
    return val;
  }

  public getGenericFileList(genericId: string, genericTypeId: string, fileType: string) {
    return this.httpClient.get(environment.apiURL + this.path + '/genericid/' + genericId + '/genericidtype/' + genericTypeId + '/filetype/' + fileType)
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  public deleteFile(_id: string) {
    const temp: GenericFileModel[] = this.currentFileList.getValue();
    temp.forEach((item, index) => {
        if (item._id === _id) {
          temp.splice(index, 1);
        }
    });
    this.currentFileList.next(temp);
    if (_id !== null || _id !== undefined ) {
        return this.httpClient.delete(environment.apiURL + this.path + '/fileid/' + _id);
    }
  }

  public replaceFile(file: GenericFileModel) {
    const temp: GenericFileModel[] = this.currentFileList.getValue();

    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id === undefined) {
        temp[i] = file;
        break;
      }
    }
    this.currentFileList.next(temp);
  }

  public downloadFiles(genericId: string, genericTypeId: string, fileType: string) {
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/zip')};
    return this.httpClient.get(environment.apiURL + this.downloadpath + '/genericid/' + genericId + '/genericidtype/' 
    + genericTypeId + '/filetype/' + fileType, {responseType: 'blob'} )
  }





}
