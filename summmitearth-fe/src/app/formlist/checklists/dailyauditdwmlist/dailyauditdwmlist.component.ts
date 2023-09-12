import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { LoadingController, AlertController, IonItemSliding, IonRefresher, IonList, NavController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { FormControl, FormGroup } from '@angular/forms';

import { StaticlistService } from 'src/app/shared/staticlist.service';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthService } from 'src/app/admin/users/auth.service';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { DailyAuditDwmModel } from '../dailyauditdwm/dailyauditdwm.model';
import { DailyauditdwmService } from '../dailyauditdwm/dailyauditdwm.service';
import { isNumber } from 'util';

@Component({
  selector: 'app-dailyauditdwmlist',
  templateUrl: './dailyauditdwmlist.component.html',
  styleUrls: ['./dailyauditdwmlist.component.scss'],
})

export class DailyauditdwmlistComponent implements OnInit {
  @ViewChild('slidingItem') slidingItem: IonItemSliding;
  @ViewChild('ionSlidingList', { static: true }) ionSlidingList: IonList;

  reportList: any[];
  dailyAuditDWMService: DailyauditdwmService;
  staticListService: StaticlistService;
  sharedService: SharedService;
  authService: AuthService;
  manageConfigService: ManageConfigService;
  loadingController: LoadingController;
  alertController: AlertController;
  navController: NavController;
  reportListSub: Subscription;
  router: Router;
  isMobile: boolean;

  form: FormGroup;
  isPhone = false;
  viewWidth = 0;
  currentUser;

  constructor(
    dailyAuditDWMService: DailyauditdwmService,
    sharedService: SharedService,
    authService: AuthService,
    manageConfigService: ManageConfigService,
    staticListService: StaticlistService,
    loadingController: LoadingController,
    alertController: AlertController,
    navController: NavController,
    router: Router,
    ) {
    this.dailyAuditDWMService = dailyAuditDWMService;
    this.staticListService = staticListService;
    this.sharedService = sharedService;
    this.manageConfigService = manageConfigService;
    this.loadingController = loadingController;
    this.alertController = alertController;
    this.router = router;
    this.navController = navController;
    this.viewWidth = this.sharedService.getPlaformWidth();
    this.authService = authService;
    this.currentUser = this.authService.getCurrentUser();
    this.isMobile = this.sharedService.isMobileDevice();
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

      let val1 = new Date();
      val1 = this.sharedService.resetTime(val1);

      let val2 = new Date();
      val2.setDate(val1.getDate() - 28);
      this.sharedService.resetTime(val2);
      this.form.get('startDate').setValue(val2.toISOString());
      this.form.get('endDate').setValue(val1.toISOString());
      this.form.updateValueAndValidity();
      console.log('ng init');
    }

    ionViewWillEnter() {
      this.getDailyAuditList();
      this.staticListService.getDailyAuditDWMLists();
    }

    refreshPage(event: any, refresher: IonRefresher) {
      this.getDailyAuditList();
      refresher.complete();
    }

    async createNewReport() {
        const alert = await this.alertController.create({
          subHeader: 'New Field Report',
          message: 'Enter the Job Number for the Daily Audit DWM',
          inputs: [
            {
              name: 'jobNumber',
              type: 'number',
              min: 1,
              id: 'jobNumber',
              placeholder: 'Job Number'
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
                if (val.jobNumber !== null && val.jobNumber !== undefined && val.jobNumber !== '' && Number(val.jobNumber) > 0) {
                  this.validateJobNumber(val.jobNumber);
                } else {
                  this.sharedService.showNotification('A Job Number is Required to Setup a New Daily Audit DWM Report', 'danger');
                }
              }
            }
          ]
        });

        await alert.present();
    }

    validateJobNumber(jobNumber) {
      // Does not need to tie to a project anymore
      if (!isNaN(jobNumber)) {
        this.startNewReport(jobNumber);
      } else {
        this.sharedService.showNotification('The Job Number must be numeric', 'danger');
      }

      /*
      this.manageConfigService.getProjectByJobNumber(jobNumber).subscribe((val: any) => {
        if (val !== null) {
          this.startNewReport(jobNumber);
        } else {
          this.sharedService.showNotification('The Project Number does not exist in the current system', 'danger');
        }
      }, (err: any) => {
        this.sharedService.showNotification('The Project Number does not exist in the current system', 'danger');
      }) ; */
    }

    startNewReport(jobNumber) {
      this.dailyAuditDWMService.clearFormSubject();
      const user = this.authService.getCurrentUser();
      this.dailyAuditDWMService.setDefaultValues(jobNumber, user._id, user.firstName + ' ' + user.lastName);
      this.router.navigate(['checklist', 'dailyauditdwmlist', 'dailyauditdwm']);
      console.log ('save report ');
    /* this.dailyAuditDWMService.saveDFR(this.currentDFR).subscribe(val => {
          this.dailyAuditDWMService.setCurrentDFR(val);
          this.reportList.push(val);
        
      }); */
    }

    async getDailyAuditList() {
      let val1 = this.form.value.startDate;
      let val2 = this.form.value.endDate;
      this.reportList = [];

      if (val1 !== null && val2 !== null) {
        const loader = await this.loadingController.create({
          message: 'Loading Daily Audit DWM, One Moment.',
          animated: true
        }).then(loaderElement => {
          loaderElement.present();
          this.reportListSub = this.dailyAuditDWMService.getReportListByDateAndAssignedToUserId(val1, val2, this.currentUser._id).subscribe( val => {
            this.reportList = val;
            loaderElement.remove();
            this.reportListSub.unsubscribe();
          }, err => {
            loaderElement.remove();
          });
        });
      }
    }

    editReport(item: DailyAuditDwmModel, slidingItem: IonItemSliding) {
      slidingItem.close();
      this.itemClicked(item);
    }

    copyReport(item: any, slidingItem: IonItemSliding) {
      slidingItem.close();
      const report: DailyAuditDwmModel = <DailyAuditDwmModel >item;

      this.dailyAuditDWMService.copyReport(report._id).subscribe(val => {
        this.sharedService.showNotification('Daily Audit DWM Report Copied');
        const newReport = <DailyAuditDwmModel >val;
        //this.dailyAuditDWMService.setCurrentReport(newReport);
        this.reportList.push(newReport);
        this.router.navigate(['checklist', 'dailyauditdwmlist', 'dailyauditdwm', 'id', newReport._id]);
      });
    }

    async deleteReport(item: string, slidingItem: IonItemSliding) {
      console.log( 'Delete Item: ' + item);
      slidingItem.close();
      const alert = await this.alertController.create({
          message: 'Are you sure you want to delete this report',
          buttons: [
            {text: 'Yes',
            handler: (val) => {
              this.dailyAuditDWMService.delete(item).subscribe(val => {
                  console.log ('Delete request complete');
                  this.sharedService.showNotification('Report Record Deleted');
                  this.getDailyAuditList();
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
      if (item.reportStatus !== 'Submitted' || this.currentUser.isAdmin ) {
         this.dailyAuditDWMService.setSelectedDailyAudit(item);
         this.router.navigate(['checklist', 'dailyauditdwmlist', 'dailyauditdwm', 'id', item._id]);
          // Get second page before navigating
      } else {
        this.sharedService.showNotification('This Daily Audit Report is already submitted and cannot be changed', 'danger', 2500);
      }
    }

    startDateChange(event) {
      let val1: Date = new Date(event.detail.value);
      val1 = this.sharedService.resetTime(val1);
      this.form.get('startDate').setValue(val1.toISOString());
    }

    endDateChange(event) {
      let val1: Date = new Date(event.detail.value);
      val1 = this.sharedService.resetTime(val1);
      this.form.get('endDate').setValue(val1.toISOString());
    }


    goToAdmin() {
      this.router.navigate(['login']);
    }

    backToList() {
      this.router.navigate(['welcome']);
    }

}
