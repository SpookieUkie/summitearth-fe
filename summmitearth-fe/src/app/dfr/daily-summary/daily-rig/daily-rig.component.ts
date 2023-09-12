import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, ValidationErrors } from '@angular/forms';
import { PopoverController, LoadingController, AlertController, IonRefresher, NavController, IonInput, MenuController, IonSelect, IonLabel } from '@ionic/angular';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { DfrService } from '../../dfr.service';
import { DfrRigService } from '../dfrrig.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { DFRPhotoService } from '../dfr-photo/dfr-photo.service';
import { DfrPhotoModel } from '../dfr-photo/dfr-photo.model';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { Subscription } from 'rxjs';
import { DfrDailyRigModel } from './daily-rig.model';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { DfrModel } from '../../dfr-model';
import { ProjectTypeModel } from 'src/app/admin/project/projecttype.model';
import { ProjectLocationModel } from 'src/app/admin/project/projectlocation.model';
import * as moment from 'moment';
import { DfrDailySalinityModel } from '../daily-salinity/daily-salinity.model';
import { Plugins } from '@capacitor/core';
import { DfroptionsComponent } from 'src/app/shared/dfroptions/dfroptions.component';
import { GeolocationComponent } from 'src/app/shared/geolocation/geolocation.component';
import { DfrDailyDisposalModel } from './daily-disposal.model';
import { DfrDailyDisposalFormModel } from './daily-disposal-form.model';
import { DfrDailySalinityFormModel } from '../daily-salinity/daily-salinity-form.model';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';

const { Geolocation } = Plugins;


@Component({
  selector: 'app-daily-rig',
  templateUrl: './daily-rig.component.html',
  styleUrls: ['./daily-rig.component.scss'],
})

export class DailyRigComponent implements OnInit {
  @ViewChild('geolocation', { static: true }) geolocation: GeolocationComponent;
  @ViewChild('crossingLocation', {static: true}) crossingLocation: IonSelect;
  @ViewChild('crossingLocationLabel', {static: true}) crossingLocationLabel: IonLabel;
  form: FormGroup;
  dfrId: string;
  rigId: string;
  coords: {};
  isMobileDevice = true;

  photoList: DfrPhotoModel[] =  [];
  disposalMethodList: any[];
  currentActivityList: any[];

  currentDFR: DfrModel;
  currentDFRRig: DfrDailyRigModel;
  currentDFRRigSub: Subscription;
  projectType: ProjectTypeModel;
  filteredLocations: ProjectLocationModel[];

  viewWidth = 0;
  forceValidated = false;

  constructor(
    private dfrService: DfrService,
    private dfrRigService: DfrRigService,
    private sharedService: SharedService,
    private dfrPhotoService: DFRPhotoService,
    private staticlistService: StaticlistService,
    private manageconfigService: ManageConfigService,
    private cacheSaveDataService: CacheSaveDataService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private navController: NavController
    ) {
    this.viewWidth = this.sharedService.getPlaformWidth();
    this.isMobileDevice = this.sharedService.isMobileDevice();
  }

  ngOnInit() {

    this.form = this.formBuilder.group({
      name: [''],
     _id: new FormControl(null, {
       updateOn: 'blur',
     }),
     dfrId: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     rigNameNumber: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     entryLocation: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     exitLocation: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     crossingLocation: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     crossingName: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     currentActivity: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     crossingLength: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     totalCrossingVolume: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     mudTested: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     crossingProgress: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     rigComments: new FormControl(null, {
       updateOn: 'blur',
       validators: [Validators.required]
     }),
     salinities: this.formBuilder.array([]),
     disposalAreas: this.formBuilder.array([])

   });

  }


  ionViewWillEnter() {
    console.log("VIEW DID ENTER");

    /*this.staticlistService.getDisposalMethodList('pipeline')
    .subscribe(data => {
      this.disposalMethodList = data;
    }); */

    this.staticlistService.getCurrentActivityList('pipeline')
    .subscribe(data => {
      this.currentActivityList = data;
    });


    this.activatedRoute.params.subscribe(val => {
      this.dfrId = val.dfrid;
      this.rigId = val.rigid;
      this.validateDFR();
    });


    this.currentDFRRigSub = this.dfrRigService.getCurrentDFRRig().subscribe(val => {
      this.currentDFRRig = val;
      if (val === null || val === undefined) {
        if (this.rigId === null) {
           this.backToRigList();
        } else {
          this.dfrRigService.getDFRRig(this.rigId).subscribe( val2 => {
            this.currentDFRRig = val2;
            this.setFormData();
          }, (err) => {
            this.backToRigList();
          });
        }
      } else {
        this.setFormData();
      }
    });
  }

  ionViewWillLeave() {
    console.log("VIEW DID LEAVE");

    let controlSal = <FormArray>this.form.controls.salinities;
    let i = 0;
    for (i = controlSal.length - 1; i >= 0; i--) {
      controlSal.removeAt(i);
    }

    let controlDis = <FormArray>this.form.controls.disposalAreas;
    let j = 0;
    for (j = controlDis.length - 1; j >= 0; j--) {
      controlDis.removeAt(i);
    }
    this.currentDFRRigSub.unsubscribe();

  }

  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }
 

  validateDFR() {
     // Check if DFR and Job info match
     console.log( 'validate dfr');
    this.dfrService.getCurrentDFR().subscribe(val => {
      this.currentDFR = val;
      if (this.currentDFR === null) {
        this.dfrService.getDFRByDfrId(this.dfrId).subscribe(val2 => {
          this.currentDFR = val2;
          this.validateLocation();
        });
      } else {
          this.validateLocation();
      }
    });
  }

  validateLocation() {
    this.manageconfigService.projectTypeForJob.asObservable().subscribe( val => {
      this.projectType = val;
      if (this.projectType === null || Number(this.currentDFR.projectNumber) !== Number(this.projectType.projectNumber)) {
        if (this.currentDFR.projectNumber !== null && this.currentDFR.projectNumber !== undefined) {
          this.manageconfigService.getProjectByProjectNumberAndProjectType(this.currentDFR.projectNumber, this.currentDFR.projectType).subscribe( val2 => {
              this.projectType = val2;
              this.disposalMethodList = this.projectType.disposalMethods.filter((val2) => {
                return val2.isActive === true;
              });
              this.setFilteredLocations();
          });
        }
      } else {
        this.setFilteredLocations();
      }
    });
  }

  setFormData() {
    // Update controls for salinities Form Group
    if (this.currentDFRRig.salinities === null) {
      this.currentDFRRig.salinities = new Array<DfrDailySalinityModel>();
    }

    const controlDis = <FormArray>this.form.controls.disposalAreas;
    const controlSal = <FormArray>this.form.controls.salinities;
    let i = 0;
    this.currentDFRRig.salinities.forEach(sal => {
      controlSal.push(this.formBuilder.group(new DfrDailySalinityFormModel(sal)));
      i++;
    });

    this.currentDFRRig.disposalAreas.forEach(dis => {
      controlDis.push(this.formBuilder.group(new DfrDailyDisposalFormModel(dis)));
      i++;
    });


    for (const i in this.form.controls) {
      if (i !== '_id' && i !== 'salinities' && i !== 'coords' && i !== 'disposalAreas') {

        if (i === 'currentActivity' || i === 'crossingLocation') {
          setTimeout(() => {
            this.form.get(i).setValue(this.currentDFRRig[i]);
          }, 500);
        } else {
          this.form.get(i).setValue(this.currentDFRRig[i]);
        }
      }
    }

    //Set coords
    if (this.currentDFRRig.coords !== null && this.currentDFRRig.coords !== undefined) {
      this.form.value.coords = this.currentDFRRig.coords;
      this.coords = this.currentDFRRig.coords;
    }
    this.getPhotoList();
  }

  //TODO: Filter for techs only. Admin should see all
  setFilteredLocations() {
      const dfrDate = moment(this.currentDFR.dfrDate).startOf('day').toDate();
      this.filteredLocations = this.sharedService.filterList(dfrDate, this.projectType.locations);
      this.form.get('crossingLocation').setValue(this.currentDFRRig['crossingLocation']);
     
      this.crossingLocation.selectedText = this.currentDFRRig['crossingLocation'];
      
      this.crossingLocationLabel.position = "stacked";
  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getPhotoList();
    refresher.complete();
  }

  updateCoords(event) {
    console.log (event);
    this.form.value.coords = event;
    this.form.markAsDirty();
  }

  
  async getPhotoList() {
    let loaderElement;
    try {
      const loader = await this.loadingController.create({
        message: 'Loading photos, one moment please.'
      }).then(le => {
          loaderElement = le;
          loaderElement.present();
          this.dfrPhotoService.getDFRPhotoList(this.rigId).subscribe(val => {
            this.photoList = val;
            this.dfrPhotoService.setCurrentRigPhotoList(this.photoList);
            loaderElement.remove();
          }, err => {
            loaderElement.remove();
        });
    });
    } catch (err) {
      loaderElement.remove();
    }

  this.getOfflinePhotos();

   //
  }

  async getOfflinePhotos() {
    //if (!this.cacheSaveDataService.status.connected) {
       //const cachedData = this.cacheSaveDataService.get2()
       const keys = await this.cacheSaveDataService.getKeys();
       for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.indexOf('reqcache') !== -1 && key.indexOf('dfrphoto') !== -1) {
          console.log ('------ key ' +  key);
          const val =  await this.cacheSaveDataService.get2(key);
          console.log ('------ val ' +  val);
          this.photoList.push (val.body);
          this.dfrPhotoService.setCurrentRigPhotoList(this.photoList);
        }
      }
    //}
  }

  async presentCrossingPopover(event) {
    const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          'title': 'Crossing Progress - Tip',
          'message': 'List how far along each section they have progressed; ie. pilot complete, 300 m of 18" ream complete.'
        },
        event: event
      });
    return await popover.present();
  }

  async presentCommentsPopover(event) {
    const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          'title': 'Comments - Tip',
          'message': 'If reaming, indicate push/pull and size, if no field test results, indicate why, i.e. not drilling, no change from yesterday, etc.'
        },
        event: event
      });
    return await popover.present();
  }

  async saveRig() {
    this.form.value.dfrId = this.dfrId;
    this.form.value._id = this.rigId;
    //this.form.value.coords = this.coords;
    console.log (' Save Rig');
    console.log (this.form.value);
    const loader = await this.loadingController.create({
      message: 'Saving Rig for Daily Field Report, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.dfrRigService.saveDFRRig(this.form.value).subscribe( val => {
        loaderElement.remove();
        this.sharedService.showNotification('Daily Field Report - Rig Saved');
        this.form.markAsPristine();
      }, error => {
        loaderElement.remove();
        console.log(error);
        
        //this.sharedService.showAlert('Error Saving DFR Rig. Please ensure all fields are valid');
      });
    });
  }



  backToRigList() {
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'dfrrigs']);
  }

  addPhoto() {
    console.log ('Add Photo');
    this.photoList.push(new DfrPhotoModel(null, null, null, null, null, null, null, null, false, null));
    this.sharedService.showNotification('New Photo Component Added');
    this.form.markAsDirty();
  }

 
  get disposalAreas(): FormArray {
    return this.form.get('disposalAreas') as FormArray;
  }

  addDisposalSummary() {
    const control = <FormArray>this.form.controls.disposalAreas;
    const dis = new DfrDailyDisposalModel(null, '', '', 0);
    control.push(this.formBuilder.group(dis));
    this.form.markAsDirty();
  }

  removeDisposal(loc) {
    const control = <FormArray>this.form.controls.disposalAreas;
    control.removeAt(loc);
    this.updateTotalVolume();
    this.form.markAsDirty();
  }


  get salinities(): FormArray {
    return this.form.get('salinities') as FormArray;
  }

  addFieldResult() {
    const control = <FormArray>this.form.controls.salinities;
    const sal = new DfrDailySalinityModel(null, null, null, null, null, null, null, null, null, null, null, null);
    control.push(this.formBuilder.group(sal));
    this.form.markAsDirty();
  }

  removeSalinity(loc) {
    const control = <FormArray>this.form.controls.salinities;
    control.removeAt(loc);
    this.form.markAsDirty();
  }

  async showTopMenu(event) {
    console.log ('top menu');
    const popover = await this.popoverController.create({
      component: DfroptionsComponent,
      componentProps: {
        'dfrId': this.dfrId,
        'currentView': 'dailyRig'
      },
      event: event,
      translucent: true,
      mode: 'ios',
      cssClass: 'dfrMenuPopover'
    });

    popover.onDidDismiss()
    .then((result: any) => {
      console.log(result.data);
     this.onMenuItem(result.data);
    });
    return await popover.present();
  }


  updateTotalVolume() {
    let total = 0;
    const fa: FormArray  = <FormArray>this.form.controls.disposalAreas;
    const list = fa.controls;
    let j = 0;
    for (j = list.length - 1; j >= 0; j--) {
      let v = list[j].value.dailyVolume;
      if (v !== null && v !== undefined) {
        total = total + v;
      }
    }

    console.log(total);
    this.form.get('totalCrossingVolume').setValue(total);
  }



  onMenuItem(item) {
    console.log('item val');
    console.log (item);
    if (item === 'dfrSummary') {
      this.onDFRSummary();
    } else if (item === 'dailyMud') {
      this.onAddMud();
    } else if (item === 'addPhoto') {
      this.addPhoto();
    } else if (item === 'addFieldTest') {
      this.addFieldResult();
    } else if (item === 'addDisposal') {
      this.addDisposalSummary();
    } else if (item === 'mudSummary') {
      this.onSummaryMud();
    } else if (item === 'getCoordinates') {
      this.geolocation.getGeoLocation();
    } else if (item === 'createPDF') {
       // Do Nothing
    } 
  }

  onDFRSummary() {
    this.router.navigate(['tabs', 'dfr', this.dfrId]);
  }

  onAddMud() {
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'mud']);
  }

  onSummaryMud() {
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'mudsummary']);
  }

  onSaveForm() {
    this.saveRig();
  }


}
