import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, PopoverController, LoadingController, IonInput, IonRefresher, IonCol } from '@ionic/angular';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { FormlistService } from '../../formlist.service';
import { SharedService } from 'src/app/shared/shared.service';
import { CalendarpickerComponent } from 'src/app/shared/calendarpicker/calendarpicker.component';
import { Subscription } from 'rxjs';
import { DailyauditdwmService } from './dailyauditdwm.service';
import { DailyAuditDwmModel } from './dailyauditdwm.model';
import { DailyAuditDWMFormModel } from './dailyauditdwm-form.model';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { DailyAuditDwmSprayfieldModel } from './dailyauditdwmsprayfield.model';
import { DailyAuditDWMSprayfieldFormModel } from './dailyauditdwmsprayfield-form.model';
import * as moment from 'moment';
import { GenericPhotoModel } from 'src/app/shared/genericphoto/genericphoto.model';
import { GenericPhotoService } from 'src/app/shared/genericphoto/genericphoto.service';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { GenericFileModel } from 'src/app/shared/genericfile/genericfile.model';
import { FilesService } from 'src/app/shared/genericfile/genericfile.service';
import * as FileSaver from 'file-saver';
import { ClientsService } from 'src/app/admin/clients/clients.service';



@Component({
  selector: 'app-dailyauditdwm',
  templateUrl: './dailyauditdwm.component.html',
  styleUrls: ['./dailyauditdwm.component.scss'],
})
export class DailyAuditDwmComponent implements OnInit {
  @ViewChild('inspectionDate') inspectionDate: IonInput;


  form: FormGroup;
  viewWidth = 1000;
  forceValidated = false;
  hideBarrier = false;
  provinces: any[];
  cementStorageType: any[];
  wellTypes: any[];
  timeOfInspections: any[];
  seasons: any[];
  clients: any[];
  subs: Subscription[];
  isMobileDevice = false;
  genericPhotoList: GenericPhotoModel[] =  [];
  genericFileList: GenericFileModel[] =  [];
  genericIdType = 'dailyauditdwm';
  genericId = '';
  fileSub: Subscription;


  // Dynamic Labels
  receivingSoilSARLabel = 'Receiving Soil SAR < 4';
  slopeLabel = 'Slope <5%';
  proximityToWaterLabel = '> 100m';

  popover;

  dailyAuditDwmFormSub: Subscription;
  dailyAuditDwmArray: FormArray;

  dailyAuditDwmModelSub: Subscription;
  dailyAuditDwmModel: DailyAuditDwmModel;


  constructor(
    private router: Router,
    private menuController: MenuController,
    private cacheSaveDataService: CacheSaveDataService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private formlistService: FormlistService,
    private sharedService: SharedService,
    private staticListsService: StaticlistService,
    private dailyAuditDwmService: DailyauditdwmService,
    private genericPhotoService: GenericPhotoService,
    private formBuilder: FormBuilder,
    private genericFileService: FilesService,
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientsService
  ) {
    this.viewWidth = this.sharedService.getPlaformWidth();
    this.isMobileDevice = this.sharedService.isMobileDevice();
    console.log('daily constructor');
    this.initForm();
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    console.log('ion view will enter');
    if (this.form === undefined || this.form === null) {
      this.initForm();
      //this.prepareForm();
    }
  }


  initForm() {
    this.subs = [];
      this.subs.push(this.staticListsService.getProvinceList('dwm').subscribe(data => {
        this.provinces = data;
      }));
      this.subs.push(this.staticListsService.getCementStorageTypeList('dwm').subscribe(data => {
        this.cementStorageType = data;
      }));
      this.subs.push(this.staticListsService.getWellTypeList('dwm').subscribe(data => {
        this.wellTypes = data;
      }));
      this.subs.push(this.staticListsService.getTimeOfInspectionList('dwm').subscribe(data => {
        this.timeOfInspections = data;
      }));
      this.subs.push(this.staticListsService.getSeasonList('dwm').subscribe(data => {
        this.seasons = data;
      }));
      this.subs.push(this.clientsService.getAllClients().subscribe((val: any) => {
        this.clients = val.data;
      }));
      this.dailyAuditDwmFormSub = this.dailyAuditDwmService.dailyauditdwm$.subscribe(val => {
        this.form = val;
        this.dailyAuditDwmModel = this.dailyAuditDwmService.dailyAuditDWMModel$.value;
        if (this.dailyAuditDwmModel === null) {
          this.checkToLoadAudit();
        } else {
          this.prepareForm();
        }
      });
  }

  checkToLoadAudit() {
    console.log ('Check to load audit');
    this.subs.push(this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('dailyauditdwm')) {
        this.dailyAuditDwmService.getSingleDailyAudit(paramMap.get('dailyauditdwm')).subscribe (val => {
          this.dailyAuditDwmService.setSelectedDailyAudit(val);
        });
      } else {
        this.backToList();
      }
    })
    );
  }

  getPopupNote(key) {
    return this.dailyAuditDwmService.getNaNoteByKey(key);
  }

  prepareForm() {
    this.genericId = this.dailyAuditDwmModel._id;
    console.log ('prepare form');
    console.log (this.genericId);
    const fields = this.form.get('sprayfieldLocations') as FormArray;

    if (this.dailyAuditDwmModel.sprayfieldLocations  !== undefined) {
      while (fields.length < this.dailyAuditDwmModel.sprayfieldLocations.length) {
        this.addSprayField();
      }
        //Hack for cached sprayfields that won't clear on exit.
      while (fields.length > this.dailyAuditDwmModel.sprayfieldLocations.length) {
        this.removeSprayfield(fields.length - 1);
      }
    }
    if (fields.length === 0) { //If new, will need to add one
      this.addSprayField();
    }
    this.setFormValues();
    this.setCompliance();
    this.getGenericPhotos();
    this.getGenericFiles();
  }

  setFormValues() {
     // tslint:disable-next-line: no-trailing-whitespace
   for (const i in this.form.controls) {
      if (i === 'inspectionDate') {
        setTimeout(() => {
          this.sharedService.setFormDate(this.dailyAuditDwmModel, this.form, i, this.inspectionDate, true);
        }, 5);
      } else if (i === 'province' || i === 'timeOfInspection' || i === 'clientName') {
         setTimeout(() => {
          if (this.dailyAuditDwmModel[i] !== undefined) {
            this.form.get(i).setValue(this.dailyAuditDwmModel[i]);
          }
         }, 5);
      } else if (i === 'naNotes') {
        // Do Nothing
      } else {
        if (this.dailyAuditDwmModel[i] !== undefined) {
          this.form.get(i).setValue(this.dailyAuditDwmModel[i]);
        }
      }
    }
    console.log ('done form');
    if (this.dailyAuditDwmModel._id === null || this.dailyAuditDwmModel._id === undefined) {
      if (this.cacheSaveDataService.status.connected) {
        setTimeout(() => {
          this.onSaveForm();
        }, 2000);
      }
    }
   /* this.dailyAuditDwmFormSub.unsubscribe();
    for (let i = this.subs.length - 1; i > 0; i--) {
      this.subs[i].unsubscribe();
    }
    console.log(this.subs); */
  }

  ionViewWillLeave() {

    const fields =  <FormArray>this.form.controls.sprayfieldLocations;
    for (let i = fields.length - 1; i >= 0; i--) {
      fields.removeAt(i);
    }
    console.log (fields.length);

    this.dailyAuditDwmFormSub.unsubscribe();
    for (let i = this.subs.length - 1; i >= 0; i--) {
      this.subs[i].unsubscribe();
      this.subs.pop();
    }
    this.form = null;

    console.log(this.subs);
    console.log(this.subs);
  }

  setCompliance() {

      if (this.form.get('province').value === 'Saskatchewan') {
        this.receivingSoilSARLabel = 'Receiving Soil SAR < 6';
        this.slopeLabel = 'Slope <5%';
        if (this.form.get('regCompSeason').value === 'Winter') {
          this.proximityToWaterLabel = 'Proximity to Water > 200m';
        } else {
          this.proximityToWaterLabel = 'Proximity to Water > 100m';
        }
        this.hideBarrier = false;

      } else { // Will be AB,
        this.receivingSoilSARLabel = 'Receiving Soil SAR < 4';
        this.proximityToWaterLabel = 'Proximity to Water > 100m';
        if (this.form.get('regCompSeason').value === 'Winter') {
          this.slopeLabel = 'Slope <3%';
        } else {
          this.slopeLabel = 'Slope <5%';
        }
        this.hideBarrier = true;
      }

      if (this.form.get('province').value === '' || this.form.get('province').value === null) {
        this.hideBarrier = false;
      }
  }

  itemSelected(val) {
    if (val === 'addsprayfield') {
      this.addSprayField();
      this.popover.dismiss();
    } else if (val === 'addphoto') {
      this.addPhoto();
    } else if (val === 'addfile') {
      this.addFile();
    } else if (val === 'auditexcel') {
      this.generateReport();
    } else if (val === 'downloadattachments') {
      this.downloadFiles();
    } else if (val === 'submitchecklist') {
      this.submitForm();
    }
  }

  addSprayField() {
    const fields = this.form.get('sprayfieldLocations') as FormArray;
    fields.push(this.formBuilder.group(new DailyAuditDWMSprayfieldFormModel()));
    if (fields.length > 1) {
      this.sharedService.showNotification('Sprayfield Added');
    }
  }

  addPhoto() {
    let ph = new GenericPhotoModel();
    ph = this.genericPhotoService.initPhoto(this.dailyAuditDwmModel._id, this.genericIdType);
    this.sharedService.showNotification('New Photo Component Added');
    this.genericPhotoList.push(ph);
  }

  addFile() {
    let fl = new GenericFileModel();
    fl = this.genericFileService.initFile(this.dailyAuditDwmModel._id, this.genericIdType);
    this.sharedService.showNotification('New File Component Added');
    this.genericFileList.push(fl);
  }

  removeSprayfield(j) {
    const fields = this.form.get('sprayfieldLocations') as FormArray;
    fields.removeAt(j);
    this.sharedService.showNotification('Sprayfield Removed');
  }

  async downloadFiles() {
    const loader = await this.loadingController.create({
      spinner: 'crescent',
      animated: true,
      message: 'Downloading Files. One Moment Please.'
    });
    loader.present();
    this.subs.push(this.genericFileService.downloadFiles(this.dailyAuditDwmModel._id, this.genericIdType, 'form').subscribe (val => {
      if (this.sharedService.isMobileDevice()) {
        this.sharedService.openZip(val).then(val => {
        });
       } else {
          const filename = 'Files_' + this.sharedService.generateId() + '.zip';
          FileSaver.saveAs(val, filename);
       }
       loader.dismiss();
    }));
  }

  async generateReport() {
    const loader = await this.loadingController.create({
      message: 'Creating Daily Audit DWM Document, One Moment Please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.fileSub = this.dailyAuditDwmService.generateReport(this.dailyAuditDwmModel._id).subscribe((val: any) => {
          const filePath = val.data.filePath;
          const fileName = val.data.fileName;

          if (this.sharedService.isMobileDevice()) {
              this.sharedService.openReportOnDevice(filePath, fileName);
          } else {
            window.open(filePath, '_blank');
          }
          loaderElement.remove();
          this.fileSub.unsubscribe();
        }, (err) => {
          this.sharedService.showNotification('Error generating the report.  Please check all the information in the report.', 'danger', 2000);
          loaderElement.remove();
        });
    });
  }


 

  getGenericPhotos() {
    console.log ('get generic photos');
    this.subs.push(this.genericPhotoService.getGenericPhotoList(this.dailyAuditDwmModel._id, this.genericIdType, 'form').subscribe (val => {
      this.genericPhotoList = val;
      this.genericPhotoService.setCurrentPhotoList(val);
    }));
  }

  getGenericFiles() {
    console.log ('get generic files');
    this.subs.push(this.genericFileService.getGenericFileList(this.dailyAuditDwmModel._id, this.genericIdType, 'form').subscribe (val => {
      this.genericFileList = val;
      this.genericFileService.setCurrentFileList(val);
    }));
  }

  async submitForm() {
    try {
        const loader = await this.loadingController.create({
        message: 'Submitting Daily Audit DWM, one moment please.',
          animated: true
        }).then(loaderElement => {
          loaderElement.present();
          this.subs.push(this.dailyAuditDwmService.submitReport(this.form.value).subscribe( val => {
            loaderElement.remove();
            this.sharedService.showNotification('Report Submitted');
            this.form.markAsPristine();
            this.dailyAuditDwmModel = this.form.value;
            this.backToList();
          }, error => {
            console.log ('error connection');
            console.log (error);
            loaderElement.remove();
            this.sharedService.showNotification('Error Saving Document', 'danger');
          }));
      });
    } catch (error) {
      console.log ('error 2');
    }
  }

  async onSaveForm() {
    console.log (this.form);
    if (this.form.value.reportStatus === null) {
      this.form.value.reportStatus = 'Open';
    }
    this.form.get('naNotes').setValue(this.dailyAuditDwmService.dailyAuditDWMModel$.value.naNotes);
    // Save date as utc
    // No longer works, reverts to last value for some reason
    //this.form.value.inspectionDate = moment.utc(this.form.value.inspectionDate).format();
    this.form.value.inspectionDate = moment.utc(this.dailyAuditDwmModel.inspectionDate).format();
    try {
        const loader = await this.loadingController.create({
        message: 'Saving Daily Audit DWM, one moment please.',
          animated: true
        }).then(loaderElement => {
          loaderElement.present();
          this.dailyAuditDwmService.saveReport(this.form.value).subscribe( val => {
            loaderElement.remove();
            this.sharedService.showNotification('Report Summary Saved');
            this.form.markAsPristine();
            this.dailyAuditDwmModel = val ;//this.form.value;
            this.form.get('_id').setValue(val._id);
          }, error => {
            console.log ('error connection');
            console.log (error);
            loaderElement.remove();
            this.sharedService.showNotification('Error Saving Document', 'danger');
          });
      });
    } catch (error) {
      console.log ('error 2');
    }
  }


  async showCalendar (event, dateToUse) {
    console.log('Calendar');
   this.popover = await this.popoverController.create({
        component: CalendarpickerComponent,
        event: event,
        cssClass: 'calendarPopover',
        translucent: true,
        componentProps: {
          refDate: dateToUse,
          hideClear: true,
          event: event
        }
    });
    this.popover.onDidDismiss().then(val => {
        console.log (val);
        console.log(this.form.value.inspectionDate);
        if (val.data === 'clear') {
          this.form.value.inspectionDate  = null;
          this.inspectionDate.value = null;
        } else if (val.data !== null && val.data !== undefined) {
          this.form.value.inspectionDate  = val.data;
          this.inspectionDate.value = val.data.substring(0, 10);
          this.dailyAuditDwmModel.inspectionDate = val.data;
          console.log(this.form.value.inspectionDate);
        }
    });

    return await this.popover.present();
  }

  backToList() {
    this.router.navigate(['checklist', 'dailyauditdwmlist']);
  }

  refreshPage(event: any, refresher: IonRefresher) {
    refresher.complete();
  }

  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }

  getErrorClass() {
    if (this.sharedService.isMobileDevice()) {
      return 'radioErrorIos';
    } else {
      return 'radioErrorWeb';
    }
  }

  getSignature(data) {
    console.log ('data');
    console.log (data);
  }


}
