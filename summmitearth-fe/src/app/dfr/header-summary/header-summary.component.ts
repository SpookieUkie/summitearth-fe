import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DfrModel } from '../dfr-model';
import { DfrService } from '../dfr.service';
import { PopoverController, LoadingController, AlertController, NavController, IonInput, MenuController, IonSelect, IonRefresher, IonLabel } from '@ionic/angular';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Subscription, Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { DfrActivityService } from '../activity-summary/dfr-activity.service';
import * as moment from 'moment';
import { CalendarpickerComponent } from 'src/app/shared/calendarpicker/calendarpicker.component';
import { DfroptionsComponent } from 'src/app/shared/dfroptions/dfroptions.component';
import { AuthService } from 'src/app/admin/users/auth.service';
import { TechpickerComponent } from 'src/app/shared/techpicker/techpicker.component';
import { UserModel } from 'src/app/admin/users/user.model';
import { ClientsService } from 'src/app/admin/clients/clients.service';
import { ClientModel } from 'src/app/admin/clients/client.model';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { ProjectTypeModel } from 'src/app/admin/project/projecttype.model';
import { SwUpdate } from '@angular/service-worker';
import { Network } from '@capacitor/core';
import { concatMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-header-summary',
  templateUrl: './header-summary.component.html',
  styleUrls: ['./header-summary.component.scss'],
})

export class HeaderSummaryComponent implements OnInit, OnDestroy {
  @ViewChild('dfrDate') dfrDate: IonInput;
  @ViewChild('assignedTo') assignedTo: IonInput;
  @ViewChild('clientSelect', { static: true }) clientSelect: IonSelect;
  @ViewChild('clientSelectLabel', {static: true}) clientSelectLabel: IonLabel;

   mom: moment.Moment = moment();
   disposalMethodsList: any[];

  form: FormGroup;
  dfrModel: DfrModel;
  projectTypeModel: ProjectTypeModel;

  currentUser;
  currentDFR: DfrModel;
  currentDFRSub: Subscription;
  currentDFRActivitySubscription: Subscription;
  viewWidth = 0;
  forceValidated = false;
  assignedToUserId: string;
  clientId: string;
  clients: ClientModel[];
  subClients: Subscription;
  subProjectType: Subscription;
  isMobile: Boolean;
  clientName: String;


  status;
 

  constructor(
    private dfrService: DfrService,
    private authService: AuthService,
    private  sharedService: SharedService,
    private  staticlistService: StaticlistService,
    private  dfrActivityService: DfrActivityService,
    private  popoverController: PopoverController,
    private loadingController: LoadingController,
    private  alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private  clientsService: ClientsService,
    private   manageConfigService: ManageConfigService,
    private   router: Router,
    private   sw: SwUpdate
      ) {
  
    this.currentUser = this.authService.getCurrentUser();
    this.viewWidth = this.sharedService.getPlaformWidth();
    this.sw = sw;

    this.isMobile = this.sharedService.isMobileDevice();
  }

  ngOnInit() {
    

      console.log (' ON INIT Header Summary');
      this.projectTypeModel = this.manageConfigService.projectTypeModel;

      /*this.staticlistService.getDisposalMethodList('pipeline')
      .subscribe(data => {
        this.disposalMethodsList = data;
      });*/

      this.subClients = this.clientsService.getAllClients().subscribe((val: any) => {
          this.clients = val.data;
          this.subClients.unsubscribe();
      });
 

      this.form = new FormGroup({
          _id: new FormControl(null, {
            updateOn: 'blur',
          }),
          projectName: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          projectNumber: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(15)]
          }),
          projectType: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          dfrDate: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          projectLocation: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          superIntendent: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          enviroLead: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          summitProjectManager: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          client: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          solidsDisposalMethod: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          liquidsDisposalMethod: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          contactInformation: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          installedPipeSize: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          reamingProgression: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          currentWeather: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          forecastWeather: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          summitFieldRepresentative: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          summitFieldContactInformation: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          hoursOfWork: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          dfrStatus: new FormControl(null, {
            updateOn: 'blur'
          }),
          dailyActivitySummary: new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          assignedToFullName: new FormControl(null, {
            updateOn: 'blur',
          })
        });
        this.ionViewWillEnter();
        console.log ('Ion View On Init');

  }

  setClientId(event) {
    console.log (event);
    this.clientId = event.detail.value._id;
    this.clientName = event.detail.value.clientName;
    //this.form.value.client = event.detail.value.clientName;
  }

  ngOnDestroy(): void {

  }

  ionViewWillLeave() {
    console.log ('Ion View Will Leave DFR');
    console.log (this.subProjectType);
  }

  ionViewWillEnter() {
    console.log ('Ion View Will Enter');
   
    
    
      this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        
         if (this.currentDFR === undefined || this.currentDFR === null) {
            this.dfrService.getDFRByDfrId(paramMap.get('id')).subscribe(val => {
               this.currentDFR = val;
               this.getProjectSettings();
            });
         } else {
           // this.getProjectSettings();
         } 
      }
    }); 
  }


  refreshPage(event: any, refresher: IonRefresher) {
    //this.ionViewWillEnter();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.dfrService.getDFRByDfrId(paramMap.get('id')).subscribe(val => {
        this.currentDFR = val;
        this.getProjectSettings();
      });
    })
    refresher.complete();
  }

  getProjectSettings() {
      this.subProjectType = this.manageConfigService.getProjectByProjectNumberAndProjectType(this.currentDFR.projectNumber, this.currentDFR.projectType).subscribe((val2: any) => {
      this.projectTypeModel = val2;
      this.disposalMethodsList = this.projectTypeModel.disposalMethods.filter((val) => {
        return val.isActive === true;
      });
      this.setFormValues();
      this.subProjectType.unsubscribe();
   });
   if (!this.manageConfigService.isProjectTypeModelValid(this.currentDFR.projectNumber)) {
      this.subProjectType  = this.manageConfigService.getProjectByProjectNumberAndProjectType(this.currentDFR.projectNumber, this.currentDFR.projectType)
        .subscribe((val2: any) => {
          this.projectTypeModel = val2;
          this.manageConfigService.projectTypeModel$.next(val2);
          this.setProjectSettings();
          this.subProjectType.unsubscribe();
        });
   } else {
     this.setProjectSettings();
   }
   /*this.manageConfigService.projectTypeModel$.subscribe((val: any) => {
     this.setProjectSettings();
   });
    this.manageConfigService.getAndSetProjectNumber(this.currentDFR.projectNumber); */
    //this.setProjectSettings();
  }

  setProjectSettings() {
      this.disposalMethodsList = this.projectTypeModel.disposalMethods.filter((val) => {
        return val.isActive === true;
      });
      this.setFormValues();
  }

  setFormValues() {
    for (const i in this.form.controls) {
      if (i === 'dfrDate') {
        if (this.currentDFR[i] !== null) {
          let val = this.currentDFR[i].toString();
          this.form.get(i).setValue(this.currentDFR[i]);
          if (!this.isMobile) {
            this.dfrDate.value = val.substring(0, 10);
          }
          //this.form.get(i).setValue(val);
        }
      } else if (i === 'assignedToUserId') {
        this.assignedToUserId = this.currentDFR[i].toString();
      //} else if (i === 'clientId') {
       // this.clientId = this.currentDFR[i].toString();
       // this.form.get('client').setValue(this.currentDFR[i].toString());
      } else if (i === 'client') {
        //this.clientSelect.value = this.currentDFR[i].toString();
        //this.form.get('client').setValue(this.currentDFR[i].toString());
        //console.log(this.currentDFR[i].toString());
      } else if (i === 'solidsDisposalMethod' || i === 'liquidsDisposalMethod') {
         setTimeout(() => {
           if (this.currentDFR[i] !== null && this.currentDFR[i] !== undefined) {
              if ( Array.isArray(this.currentDFR[i]) ) {
                this.form.get(i).setValue(this.currentDFR[i].toString().split(','));
              } else {
                this.form.get(i).setValue(this.currentDFR[i]);
              }
           }
         }, 5);
      } else {
         this.form.get(i).setValue(this.currentDFR[i]);
      }
    }
    const that = this;
    setTimeout(() => {
      if (this.currentDFR['client'] !== null && this.currentDFR['client'] !== undefined) {
          that.form.get('client').setValue(this.currentDFR['client']);
          that.clientSelect.selectedText = this.currentDFR['client'].toString();
          that.clientSelectLabel.position = 'stacked';
          this.clientName = this.currentDFR['client'];
      }
    }, 500);
   

  }


  async showCalendar (event, dateToUse) {
    console.log('Calendar');
    const popover = await this.popoverController.create({
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
    popover.onDidDismiss().then(val => {
        console.log (val);
        if (val.data === 'clear') {
          this.form.value.dfrDate  = null;
          this.dfrDate.value = null;
        } else if (val.data !== null && val.data !== undefined) {
          this.form.value.dfrDate  = val.data;
          this.dfrDate.value = val.data.substring(0, 10);
        }
    });

    return await popover.present();
  }

  showHideFormErrors() {
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }


  async presentPopover() {
    const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          'title': 'Hours of Work - Tip',
          'message': 'If wet, a comment in the activity summary is required, ie. not rutting, too wet and shut down'
        }
      });
    return await popover.present();
  }

  async onSaveForm() {
    if (this.form.value.dfrStatus == null) {
      this.form.value.dfrStatus = 'Open';
    }
    // Save date as utc
    this.form.value.dfrDate = moment.utc(this.form.value.dfrDate).format();
    this.form.value.assignedToUserId = this.assignedToUserId; //Force to set id since no real form element exists
    this.form.value.clientId = this.clientId;
    this.form.value.client = this.clientName;
    try {
        const loader = await this.loadingController.create({
        message: 'Saving DFR, one moment please.',
          animated: true
        }).then(loaderElement => {
          loaderElement.present();
          this.dfrService.saveDFR(this.form.value).subscribe( val => {
            loaderElement.remove();
            this.sharedService.showNotification('Daily Field Report Summary Saved');
            this.form.markAsPristine();
            this.currentDFR = this.form.value;
          }, error => {
            console.log ('error connection');
            console.log (error);
            this.sharedService.showNotification('Error Saving DFR. If the issue continues, contact support', 'danger', 3000);
            loaderElement.remove();
          });
      });
    } catch (error) {
      console.log ('error 2');
    }
  }


  async onSubmitForm() {
    console.log(this.form);
    const loader = await this.loadingController.create({
      message: 'Saving DFR, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.dfrService.saveDFR(this.form.value).subscribe( val => {
        loaderElement.remove();
      }, err => {
        loaderElement.remove();
        this.showAlert('Error Saving Form');
      });
    });
    
  }


  async showAlert(message: string) {
    const alert = await this.alertController.create({
      message: message,
      header: 'Error Saving Record',
      buttons: ['OK']
    }).then(alertElement => {
      alertElement.present();
    });
  }

 
  onViewRigs() {
    this.router.navigate(['tabs', 'dfr', this.currentDFR._id, 'dfrrigs']);
  }

  onAddMud() {
    this.router.navigate(['tabs', 'dfr', this.currentDFR._id, 'mud']);
  }

  onSummaryMud() {
    this.router.navigate(['tabs', 'dfr', this.currentDFR._id, 'mudsummary']);
  }

  backToDFRList() {
    this.router.navigate(['tabs']);
  }

  getWeather() {
    if (this.form.get('projectLocation').value !== null && this.form.get('projectLocation').value !== undefined) {
       this.getWeather2();
    } else {
      this.sharedService.showNotification('Project Location is not set', 'danger');
    }
  }

  async getWeather2() {

    const loader = await this.loadingController.create({
      message: 'Loading weather based on Project Location',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.sharedService.getForecastWeather(this.form.get('projectLocation').value).subscribe((val: any) => {
        this.form.get('currentWeather').setValue(Math.round(val.main.temp) + 'C at ' + moment().format('hh:mm'));
        this.form.get('forecastWeather').setValue(Math.round(val.main.temp_max)
                    + 'C High,  ' + Math.round(val.main.temp_min) + 'C Low');
         this.sharedService.showNotification('Condtion: ' + val.weather[0].description + '. Wind at: ' + val.wind.speed
          + 'km/h.  Feels like: ' + val.main.feels_like + 'C', 'dark', 3000);
          this.form.markAsDirty();
          loaderElement.remove();
      }, (err) => {
        this.sharedService.showNotification('Weather for location not found', 'danger');
        loaderElement.remove();
      });
    });
  }

  async showTopMenu(event) {
    console.log ('top menu');
    let isLocked = false;
    if (this.currentDFR.dfrDate === null ||this.currentDFR.dfrDate === undefined || this.currentDFR.projectNumber === null 
      || this.currentDFR.projectNumber === undefined || this.currentDFR.projectNumber === '') {
        isLocked = true;
      }
    const popover = await this.popoverController.create({
      component: DfroptionsComponent,
      componentProps: {
        'dfrId': this.currentDFR._id,
        'currentView': 'dfrSummary',
        'isLocked' : isLocked,
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

  onMenuItem(item) {
    console.log('item val');
    console.log (item);
    if (item === 'dailyMud') {
      this.onAddMud();
    } else if (item === 'viewRigs') {
      this.onViewRigs();
    } else if (item === 'mudSummary') {
      this.onSummaryMud();
    } else if (item === 'getWeather') {
      this.getWeather();
    } else if (item === 'createPDF') {
     console.log (' MOve PDF CODE to class');
    }
  }

  async presentTechPopover(event) {
    const popover = await this.popoverController.create({
        component: TechpickerComponent,
       // event: event,
        cssClass: 'mudPopover',
        translucent: true,
        componentProps: {
          currentName: 'Curtis',
        }
      });
    popover.onDidDismiss().then(val => {
      console.log (val);
      console.log ('Tech Dismissed');
        if (val.data !== undefined) {
          const user = <UserModel> val.data;
          this.form.value.assignedToUserId  = user._id;
          this.assignedToUserId  = user._id;
         // this.form.get('assignedToUserId').setValue(user._id);
          this.form.get('assignedToFullName').setValue(user.firstName + ' ' + user.lastName);
          this.assignedTo.value = val.data.firstName + ' ' + user.lastName;
          this.form.get('summitFieldRepresentative').setValue(user.firstName + ' ' +  user.lastName);
          this.form.get('summitFieldContactInformation').setValue(user.cellPhone + ' ' +  user.emailAddress);
          this.form.markAsDirty();
        }
    });
    return await popover.present();
  }

  async presentProjectNumberPopover(event) {
    const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          'title': 'Project Number - Info',
          'message': 'The Project Number can only be set during the creation of a new Daily Field Report'
        },
        event: event
      });
    return await popover.present();
  }

}
