import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, AlertController, IonItemSliding, IonRefresher, IonList, NavController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CameraPhoto } from '@capacitor/core';
import { SharedService } from '../../shared/shared.service';
import { StaticlistService } from '../../shared/staticlist.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../admin/users/auth.service';
import { ManageConfigService } from '../../admin/manageconfig.service';
import { DfrRRRService } from '../dfr-rrr.service';
import { DfrRRRModel } from '../dfr-rrr.model';


@Component({
  selector: 'app-dfr-techlist',
  templateUrl: './dfr-techlist.page.html',
  styleUrls: ['./dfr-techlist.page.scss'],
})
export class DfrTechlistPage implements OnInit {
  @ViewChild('slidingItem') slidingItem: IonItemSliding;
  @ViewChild('ionSlidingList', { static: true }) ionSlidingList: IonList;


  dfrList: any[];
  currentDFR: any;
  currentDFRSub: Subscription;


  form: FormGroup;
  isPhone = false;
  viewWidth = 0;
  currentUser;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private manageConfigService: ManageConfigService,
    private staticListService: StaticlistService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navController: NavController,
    private router: Router,
    private dfrRRRservice: DfrRRRService
    ) {
    this.viewWidth = this.sharedService.getPlaformWidth();
    this.currentUser = this.authService.getCurrentUser();
    this.isPhone = this.sharedService.isCellPhone();
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


    /*
    this.dfrRRRservice.getCurrentDFR().subscribe(val => {
      this.currentDFR = val;
    }); */

    // Get List Data and store
    this.staticListService.getListTypeForRRR('rrr');
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
                this.validateProjectNumber(val.projectNumber, 'rrrDFR');
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
    this.dfrRRRservice.resetSelectedDFR(projectNumber);
    this.dfrRRRservice.getCurrentDFR().subscribe(val => {
      this.currentDFR = val;
    }, (err) => '', () => '');
    console.log ('save dfr');
    this.dfrRRRservice.saveDFR(this.currentDFR).subscribe(val => {
        this.dfrRRRservice.setCurrentDFR(val);
        this.dfrList.push(val);
        this.goToDFR(val._id);
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
       this.dfrRRRservice.getDFRListByDateAndAssignedToUserId(val1, val2, this.currentUser._id).subscribe( val => {
          this.dfrList = val;
          loaderElement.remove();
        }, err => {
          loaderElement.remove();
        }, () => '');
      });
    }
  }

  editDFR(item: any, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.itemClicked(item);
  }

  copyDFR(item: any, slidingItem: IonItemSliding) {
    slidingItem.close();
    const dfr: DfrRRRModel = <DfrRRRModel>item;

    this.dfrRRRservice.copyDFR(dfr._id).subscribe(val => {
      this.sharedService.showNotification('Daily Field Report Copied');
      const newDfr = <DfrRRRModel>val;
      this.dfrRRRservice.setCurrentDFR(newDfr);
      this.dfrList.push(newDfr);
      this.goToDFR(newDfr._id);
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
        this.dfrRRRservice.deleteDFR(item).subscribe(val => {
              console.log ('Delete request complete');
              this.sharedService.showNotification('DFR Record Deleted');
              this.getDFRList();
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
          this.dfrRRRservice.setCurrentDFR(item);
          this.sharedService.showNotification('Current Daily Field Report Loaded');
          this.goToDFR(item._id);
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

  goToDFR(id) {
    this.router.navigate( ['dfr-rrrtabs', id, 'dfrvegetationsummary']);
  }

}
