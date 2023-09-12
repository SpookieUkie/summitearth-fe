import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';


import { AlertController, LoadingController, PopoverController, IonToggle, Platform } from '@ionic/angular';
import { PhotoviewerComponent } from 'src/app/shared/photoviewer/photoviewer.component';
import { Route } from '@angular/compiler/src/core';
import { HttpUrlEncodingCodec } from '@angular/common/http';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { GenericFileModel } from './genericfile.model';
import { FilesService } from './genericfile.service';
import { GenericFileFormModel } from './genericfile-form.model';
import { Filesystem, FilesystemDirectory } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { FileTransferObject, FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File, IFile, Entry } from '@ionic-native/file/ngx';
import { FileEntry } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';


@Component({
  selector: 'app-genericfile',
  templateUrl: './genericfile.component.html',
  styleUrls: ['./genericfile.component.scss'],
})
export class GenericFileComponent implements OnInit {
  @Input() genericFile: GenericFileModel;
  @Input() reportType: string;
  @Input() basePath: string;

  form: FormGroup;
  viewWidth = 0;
  selectedFile: string;
  fileRoute = [];
  os: string;
  document;

  constructor(private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private genericFileService: FilesService,
    private cacheSaveDataService: CacheSaveDataService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private platform: Platform,
    private router: Router,
    private formBuilder: FormBuilder,
    private fileOpener: FileOpener,
    private iosFilePicker: IOSFilePicker,
    //private transfer: FileTransfer,
    private fileChooser: FileChooser,
    private file: File,
    private filePath: FilePath
    ) {
      this.viewWidth = this.sharedService.getPlaformWidth();
      this.os = this.sharedService.getOS();
   }

  ngOnInit() {
      this.form = this.formBuilder.group(new GenericFileFormModel());
      console.log(this.genericFile);
      if (this.genericFile !== null && this.genericFile._id !== undefined) {
        this.form.get('displayName').setValue(this.genericFile.displayName);
        this.form.get('fileComments').setValue(this.genericFile.fileComments);
      }
  }

  onFileChosenAndroid(event) {
    console.log ('File Chosen on Android');
    console.log (event);
    this.getFileInfoAndroid();
  }

  onFileChosenIOS(event) {
    const fileInfo: any = {};
    this.iosFilePicker.pickFile().then (val => {
      console.log ('val');
      console.log(val);
      this.document = val;
     
      const fileName = val.substr(val.lastIndexOf('/') + 1);
      const fileURL = 'file://' + val;

      /*this.file.resolveLocalFilesystemUrl(fileURL).then((entry: Entry) => {
        if (entry) {
            var fileEntry = entry as FileEntry;
            console.log (fileEntry);
            fileEntry.file(meta => { 
              this.setMetaInfo(meta);
                console.log (meta)
            }, error => {
                // no mime type found;
                console.log ('error');
            });
        }
    }).catch(err => {
      console.log (err);
    }); */

    });

  }

  setMetaInfo(meta) {
    this.form.get('displayName').setValue(meta.name);
    this.form.get('mimeType').setValue(meta.type);
    this.form.get('fileSize').setValue(meta.size);
    this.form.get('originalFileName').setValue(meta.name);
  }

  //getFileInfoAndroid(): Promise<any> {
  getFileInfoAndroid(): any {
    /* console.log ('document');
    console.log (this.document);
    return this.fileChooser.open().then(val => {
      this.document = val;
      console.log('android File Picker');
      console.log(val); 
        return this.filePath.resolveNativePath(this.document).then(filePathUrl => {
          console.log('filePathUrl');
          console.log(filePathUrl);
            return this.file.resolveLocalFilesystemUrl(this.document).then((fileEntry: any) => {
                  console.log('filentry');
                  console.log(fileEntry);
                    return new Promise((resolve, reject) => {
                      console.log('resolve/reject');
                      console.log(fileEntry.file);
                        fileEntry.file( meta => {
                          console.log('meta');
                          console.log(meta);
                            this.setMetaInfo(meta);
                        });
                    });
                });
        });
    }); */
}

  onFileChosenWeb(event) {
    console.log (event);
    console.log (event.target);

    const pickedFile = (event.target as HTMLInputElement).files[0];
    const obj = event.target.files[0];

    this.form.get('mimeType').setValue(obj.type);
    this.form.get('fileSize').setValue(obj.size);
    this.form.get('fileName').setValue(obj.name);
    this.form.get('displayName').setValue(obj.name);
  
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedFile = dataUrl;
      this.form.patchValue({ file: pickedFile});
    //  this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }

  saveFile() {
    if (this.genericFile.genericId !== null && this.genericFile.genericId !== undefined &&
      this.genericFile.genericIdType !== null && this.genericFile.genericIdType !== undefined) {
        const f = this.genericFile;
        this.form = this.genericFileService.prepareFileForSaving(
          this.form, f.genericId, f.genericIdType, f.genericSubId, f.genericSubIdType);

      if (this.genericFile._id === null || this.genericFile._id === undefined) {
        if ( this.os === 'web') {
          this.addFile();
        } else {
          this.addFileIOS();
        }
      } else {
        this.updateFile();
      }
    } else {
      this.sharedService.showNotification('The ' + this.reportType + ' must be saved first before saving the file.', 'danger');
    }
  }


  async addFileIOS() {
    const val = await this.genericFileService.saveNewGenericFileIOS(this.form, this.document);
    console.log ('val ios');
    this.getClass();
    this.getLabel();
    console.log (val);
    
  }

  async addFile() {
    const loader = await this.loadingController.create({
      message: 'Saving File, one moment please.',
      animated: true
    }).then(loaderElement => {
        loaderElement.present();
        this.genericFileService.saveNewGenericFile(this.form).subscribe((val: any) => {
           this.sharedService.showNotification('File Added to Report');
           this.form.markAsPristine();
           this.genericFile = val.data;
           this.getClass();
           this.getLabel();
           this.genericFileService.replaceFile(this.genericFile);
           loaderElement.remove();
        }, err => {
           loaderElement.remove();
        });
    });
  }

  async updateFile() {
    const loader = await this.loadingController.create({
      message: 'Saving File, one moment please.',
      animated: true
    }).then(loaderElement => {
        loaderElement.present();
        this.genericFileService.updateGenericFile(this.form, this.genericFile._id).subscribe((val: any) => {
            this.sharedService.showNotification('File Record Updated');
            this.form.markAsPristine();
            this.genericFile = val.data;
            loaderElement.remove();
            this.getClass();
            this.getLabel();
        }, err => {
          loaderElement.remove();
        });
    });
  }

  async deleteFile() {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this file?',
      buttons: [
        {text: 'Yes',
        handler: (val) => {
          // Check if record is actually created first
            this.genericFileService.deleteFile(this.genericFile._id).subscribe(val => {
                console.log ('Delete request complete');
                //remove from list
                this.sharedService.showNotification('File Deleted');
            });
        }},
        {text: 'No', handler: (val) => {
          console.log('Do Nothing');
        }}
    ],
      header: 'Delete Record'
    }).then(alertElement => {
      alertElement.present();
    }); 
  }


  getClass() {
    const mt = this.genericFile.mimeType;
    if (mt !== undefined) {
      if (mt.indexOf('pdf') !== -1) {
        return 'fi fi-pdf';
      } else if (mt.indexOf('excel') !== -1 || mt.indexOf('spreadsheet') !== -1) {
        return 'fi fi-xls';
      } else if (mt.indexOf('csv') !== -1) {
        return 'fi fi-csv';
      } else if (mt.indexOf('txt') !== -1) {
        return 'fi fi-txt';
      } else if (mt.indexOf('word') !== -1 || mt.indexOf('document') !== -1) {
        return 'fi fi-doc';
      } else if (mt.indexOf('powerpoint') !== -1 || mt.indexOf('presentation') !== -1) {
        return 'fi fi-pps';
      }  else if (mt.indexOf('kml') !== -1 || mt.indexOf('log') !== -1 || mt.indexOf('gpx') !== -1 || mt.indexOf('kmz') !== -1) {
        return 'fi fi-xml';
      }
    } else {
      return '';
    }
  }

  getLabel() {
    const mt = this.genericFile.mimeType;
    if (mt !== undefined) {
      if (mt.indexOf('pdf') !== -1) {
        return 'pdf';
      } else if (mt.indexOf('excel') !== -1 || mt.indexOf('spreadsheet') !== -1) {
        return 'xls';
      } else if (mt.indexOf('csv') !== -1) {
        return 'csv';
      } else if (mt.indexOf('txt') !== -1) {
        return 'txt';
      } else if (mt.indexOf('kml') !== -1) {
        return 'kml';
      } else if ( mt.indexOf('log') !== -1 ) {
        return 'log';
      } else if ( mt.indexOf('gpx') !== -1)  {
        return 'gpx';
      } else if (mt.indexOf('kmz') !== -1) {
        return 'kmz';
      } else if (mt.indexOf('word') !== -1 || mt.indexOf('document') !== -1) {
        return 'doc';
      } else if (mt.indexOf('powerpoint') !== -1 || mt.indexOf('presentation') !== -1) {
        return 'pps';
      }
    }
  }

  viewFile() {
    console.log ('view file');
    if (this.genericFile.fileUrl !== undefined ) {
      if (!this.platform.is('ios') && !this.platform.is('android')) {
        window.open(this.genericFile.fileUrl, '_blank');
      } else {
        this.sharedService.openOnDevice(this.genericFile);
      }
    }
  }

}
