import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DfrModel } from '../dfr/dfr-model';
import { DfrService } from '../dfr/dfr.service';
import { LoadingController, AlertController, IonItemSliding, IonRefresher, IonList, NavController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DfrActivityService } from '../dfr/activity-summary/dfr-activity.service';
import { DfrActivityModel } from '../dfr/activity-summary/dfr-activity-model';
import { CameraPhoto } from '@capacitor/core';
import { SharedService } from '../shared/shared.service';
import { StaticlistService } from '../shared/staticlist.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../admin/users/auth.service';
import { ManageConfigService } from '../admin/manageconfig.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  @ViewChild('slidingItem') slidingItem: IonItemSliding;
  @ViewChild('ionSlidingList', { static: true }) ionSlidingList: IonList;

  dfrList: any[];
  dfrListSub: Subscription;
  currentDFR: DfrModel;
  currentDFRSub: Subscription;

  currentDFRActivity: DfrActivityModel;
  currentDFRActivitySub: Subscription;
  form: FormGroup;
  isPhone = false;
  viewWidth = 0;
  currentUser;

  constructor(
    private dfrService: DfrService,
    private dfrActivityService: DfrActivityService,
    private sharedService: SharedService,
    private authService: AuthService,
    private manageConfigService: ManageConfigService,
    private staticListService: StaticlistService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navController: NavController,
    private router: Router,
    ) {
    this.viewWidth = this.sharedService.getPlaformWidth();
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {

    this.form = new FormGroup({
      startDate: new FormControl(null, {
        updateOn: 'blur',
      }),
      endDate: new FormControl(null, {
        updateOn: 'blur',
      })
    });
 
    this.isPhone = this.sharedService.isCellPhone();

    
    this.currentDFRSub = this.dfrService.getCurrentDFR().subscribe(val => {
      this.currentDFR = val;
    });

    this.currentDFRActivitySub = this.dfrActivityService.getCurrentActivityDFR().subscribe(val => {
      this.currentDFRActivity = val;
    });

    // Get List Data and store
    this.staticListService.getCurrentyActivity('pipeline');
    this.staticListService.getDisposalMethod('pipeline');
    this.staticListService.getSprayFieldCondition('pipeline');
    this.staticListService.getMudProducts();

    let val1 = new Date();
    val1 = this.sharedService.resetTime(val1);

    let val2 = new Date();
    val2.setDate(val1.getDate() - 7);
    this.sharedService.resetTime(val2);
    this.form.get('startDate').setValue(val2.toISOString());
    this.form.get('endDate').setValue(val1.toISOString());
    this.form.updateValueAndValidity();
    console.log('ng init');
    this.getDFRList();
  }

  ionViewWillEnter() {
    console.log('Ionic view did enter');
    // If admin only, move to admin dfr dashboard
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser.isAdmin && !this.currentUser.isTech) {
      this.router.navigate(['admin', 'dfrs']);
    }

  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getDFRList();
    refresher.complete();
  }

  // Save 2 document first, then load the route
  async createNewDFR() {
      const alert = await this.alertController.create({
        subHeader: 'New Daily Field Report',
        message: 'Enter the Project Number for the Daily Field Report',
        inputs: [
          {
            name: 'projectNumber',
            type: 'number',
            min: 1,
            id: 'projectNumber',
            placeholder: 'Project Number'
          }
        ],
        buttons:  [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
             // Do Nothing
            }
          }, {
            text: 'Ok',
            handler: (val) => {
              console.log('Confirm Ok');
              console.log(val);
              if (val.projectNumber !== null && val.projectNumber !== undefined && val.projectNumber !== '' && Number(val.projectNumber) > 0) {
                this.validateProjectNumber(val.projectNumber, 'epmDFR');
              } else {
                this.sharedService.showNotification('A Project Number is Required to Setup a New Daily Field Report', 'danger');
              }
            }
          }
        ]
      });

      await alert.present();
  }

  validateProjectNumber(projectNumber, projectType) {
    this.manageConfigService.getProjectByProjectNumberAndProjectType(projectNumber, projectType).subscribe((val: any) => {
      if (val !== null) {
        this.saveNewDFR(projectNumber);
      } else {
        this.sharedService.showNotification('The Project Number does not exist in the current system', 'danger');
      }
    }, (err: any) => {
      this.sharedService.showNotification('The Project Number does not exist in the current system', 'danger');
    }) ;
  }

  saveNewDFR(projectNumber) {
    this.dfrService.resetSelectedDFR(projectNumber);
    this.dfrActivityService.resetSelectedDFR();
    console.log ('save dfr');
    this.dfrService.saveDFR(this.currentDFR).subscribe(val => {
        this.dfrService.setCurrentDFR(val);
        this.currentDFRActivity.dfrId = val._id;
        this.dfrList.push(val);
        this.dfrActivityService.saveDFRAct(this.currentDFRActivity, null).subscribe(val2 => {
          this.dfrActivityService.setCurrentActivityDFR(val2);
          this.router.navigate(['tabs', 'dfr', val._id]);
        });
    });
  }

  async getDFRList() {
    let val1 = this.form.value.startDate;
    let val2 = this.form.value.endDate;
    this.dfrList = [];
   /*  val1 = this.sharedService.resetTime(val1);
    val2 = this.sharedService.resetTime(val2);
    val1 = val1.toISOString();
    val2 = val2.toISOString(); */
    if (val1 !== null && val2 !== null) {
      const loader = await this.loadingController.create({
        message: 'Loading Daily Field Reports, One Moment.',
        animated: true
      }).then(loaderElement => {
        loaderElement.present();
        this.dfrListSub = this.dfrService.getDFRListByDateAndAssignedToUserId(val1, val2, this.currentUser._id).subscribe( val => {
          this.dfrList = val;
          loaderElement.remove();
          this.dfrListSub.unsubscribe();
        }, err => {
          loaderElement.remove();
        });
      });
    }
  }

  editDFR(item: DfrModel, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.itemClicked(item);
  }

  copyDFR(item: any, slidingItem: IonItemSliding) {
    slidingItem.close();
    const dfr: DfrModel = <DfrModel>item;

    this.dfrService.copyDFR(dfr._id).subscribe(val => {
       this.sharedService.showNotification('Daily Field Report, Rigs and Mud Copied');
       const newDfr = <DfrModel>val;
       this.dfrService.setCurrentDFR(newDfr);
       this.dfrList.push(newDfr);
       this.router.navigate(['/', 'tabs', 'dfr', newDfr._id]);
    });
    console.log ('Copy DFR');
  }

  async deleteDFR(item: string, slidingItem: IonItemSliding) {
    console.log( 'Delete Item: ' + item);
    slidingItem.close();
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this DFR',
      buttons: [
        {text: 'Yes',
        handler: (val) => {
          this.dfrService.deleteDFR(item).subscribe(val => {
              console.log ('Delete request complete');
              this.sharedService.showNotification('DFR Record Deleted');
              this.getDFRList();
          });
          this.dfrActivityService.deleteDFRActByDfrId(item).subscribe( val2 => {
            console.log ('Delete activity complete');
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


  itemClicked(item) {
    if (item.dfrStatus !== 'Submitted' || this.currentUser.isAdmin ) {
        this.dfrService.setCurrentDFR(item);
        // Get second page before navigating
        this.dfrActivityService.getDFRActByDfrId(item._id).subscribe(dfrAct => {
          this.dfrActivityService.setCurrentActivityDFR  (dfrAct);
          this.sharedService.showNotification('Current Daily Field Report Loaded');
          this.router.navigate(['/', 'tabs', 'dfr', item._id]);
        });
    } else {
      this.sharedService.showNotification('This Daily Field Report is already submitted and cannot be changed', 'danger', 2500);
    }
  }

  startDateChange(event) {
    let val1: Date = new Date(event.detail.value);
    val1 = this.sharedService.resetTime(val1);
    this.form.get('startDate').setValue(val1.toISOString());
  }

  endDateChange(event) {
    let val1: Date = event.detail.value;
    val1 = this.sharedService.resetTime(val1);
    this.form.get('endDate').setValue(val1.toISOString());
  }


  goToAdmin() {
    this.router.navigate(['login']);
  }

}
