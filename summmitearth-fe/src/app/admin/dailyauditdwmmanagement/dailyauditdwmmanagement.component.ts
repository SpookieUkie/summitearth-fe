import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, IonItemSliding, IonRefresher, AlertController, PopoverController, LoadingController } from '@ionic/angular';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription, Observable } from 'rxjs';
import { UserModel } from 'src/app/admin/users/user.model';
import { AuthService } from 'src/app/admin/users/auth.service';
import { Router } from '@angular/router';
import { CalendarpickerComponent } from 'src/app/shared/calendarpicker/calendarpicker.component';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { FilesService } from 'src/app/shared/genericfile/genericfile.service';
import { Filesystem, FilesystemDirectory  } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DailyauditdwmService } from 'src/app/formlist/checklists/dailyauditdwm/dailyauditdwm.service';
import { DailyAuditDWMFormModel } from 'src/app/formlist/checklists/dailyauditdwm/dailyauditdwm-form.model';
import { DailyAuditDwmModel } from 'src/app/formlist/checklists/dailyauditdwm/dailyauditdwm.model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-dailyauditdwmmanagement',
  templateUrl: './dailyauditdwmmanagement.component.html',
  styleUrls: ['./dailyauditdwmmanagement.component.scss'],
})
export class DailyauditdwmmanagementComponent implements OnInit {

  viewWidth = 1000;
  
  audits: DailyAuditDWMFormModel[];
  form: FormGroup;
  selectedIds = new Array();
  fileSub: Subscription;

  constructor(
    private menuController: MenuController,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private filesService: FilesService,
    private fileOpener: FileOpener,
    private authService: AuthService,
    private dailyauditdwmService: DailyauditdwmService,
    private alertController: AlertController,
    private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      startDate: new FormControl(null, {
        updateOn: 'blur',
      }),
      endDate: new FormControl(null, {
        updateOn: 'blur',
      })
    });

    let val = new Date();
    val.setDate(val.getDate() - 30);
    this.form.get('startDate').setValue(val.toISOString());
    this.form.get('endDate').setValue(new Date().toISOString());
    this.form.updateValueAndValidity();
  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getReportList();
    refresher.complete();
  }

  ionViewWillEnter() {
    console.log ('view will enter');
    this.getReportList();
  }

  itemSelected(data) {
   // this.router.navigate(['admin', 'dailyauditdwm', 'id', ]);
  }

  async getReportList() {
    const loader = await this.loadingController.create({
      message: 'Loading Reports, One Moment.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.dailyauditdwmService.getReportListByDate(this.form.value.startDate, this.form.value.endDate).subscribe( (val: any) => {
        this.audits = val;
        loaderElement.remove();
      }, err => {
        loaderElement.remove();
      });
    });
  }

  viewReport(item: DailyAuditDWMFormModel) {
    this.dailyauditdwmService.setSelectedDailyAudit(item);

    if (this.sharedService.isMobileDevice()) {
      this.router.navigate(['/', 'checklist', 'dailyauditdwmlist', 'dailyauditdwm', 'id', item._id]);
    } else {
      const url = this.router.createUrlTree(['/', 'checklist', 'dailyauditdwmlist', 'dailyauditdwm', 'id', item._id]);
      window.open(environment.appURL + url.toString(), '_blank');
    }
  }

  copyReport(item: DailyAuditDwmModel) {
    const report: DailyAuditDwmModel = <DailyAuditDwmModel>item;
    this.dailyauditdwmService.copyReport(report._id).subscribe(val => {
       this.sharedService.showNotification('Daily Field Report, Rigs and Mud Copied');
       const newReport = <DailyAuditDwmModel>val;
       this.dailyauditdwmService.setSelectedDailyAudit(newReport);
       this.router.navigate(['/', 'checklist', 'dailyauditdwmlist', 'dailyauditdwm', 'id', newReport._id]);

       if (this.sharedService.isMobileDevice()) {
        this.router.navigate(['/', 'checklist', 'dailyauditdwmlist', 'dailyauditdwm', 'id', newReport._id]);
      } else {
        const url = this.router.createUrlTree(['/', 'checklist', 'dailyauditdwmlist', 'dailyauditdwm', 'id', newReport._id]);
        window.open(environment.appURL + url.toString(), '_blank');
      }
    });
  }

  async deleteReport(item: string) {
    console.log( 'Delete Item: ' + item);
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this report',
      buttons: [
        {text: 'Yes',
        handler: (val) => {
          this.dailyauditdwmService.delete(item).subscribe(val => {
              console.log ('Delete request complete');
              this.sharedService.showNotification('Report Record Deleted');
              this.getReportList();
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


  backToAdmin() {
    this.router.navigate(['admin']);
  }

  async showCalendar (event, dateToUse, target) {
    console.log('Calendar');
    dateToUse = moment();
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
          //this.form.value.dfrDate  = null;
          //this.dfrDate.value = null;
        } else if (val.data !== null && val.data !== undefined) {
          //this.form.value.dfrDate  = val.data;
          //this.dfrDate.value = val.data.substring(0, 10);
        }
    });
  }

  updateDate(data) {
    if (data.comp === 'startDate') {
      this.form.value.startDate = data.date;
    } else {
      this.form.value.endDate = data.date;
    }
  }
  

}
