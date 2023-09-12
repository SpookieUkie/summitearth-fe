
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, IonItemSliding, IonRefresher, AlertController, PopoverController, LoadingController } from '@ionic/angular';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription, Observable } from 'rxjs';
import { UserModel } from 'src/app/admin/users/user.model';
import { AuthService } from 'src/app/admin/users/auth.service';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';
import { DfrService } from 'src/app/dfr/dfr.service';
import { DfrModel } from 'src/app/dfr/dfr-model';
import { CalendarpickerComponent } from 'src/app/shared/calendarpicker/calendarpicker.component';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { FilesService } from 'src/app/shared/genericfile/genericfile.service';
import { Filesystem, FilesystemDirectory  } from '@capacitor/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-dfrmanagement',
  templateUrl: './dfrmanagement.component.html',
  styleUrls: ['./dfrmanagement.component.scss'],
})
export class DfrmanagementComponent implements OnInit {
  viewWidth = 1000;
  
  dfrs: DfrModel[];
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
    private dfrService: DfrService,
    private alertController: AlertController,
    private router: Router
    ) {

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

    let val = new Date();
    val.setDate(val.getDate() - 30);
    this.form.get('startDate').setValue(val.toISOString());
    this.form.get('endDate').setValue(new Date().toISOString());
    this.form.updateValueAndValidity();
  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getDfrs();
    refresher.complete();
  }

  ionViewWillEnter() {
    console.log ('view will enter');
    this.getDfrs();
  }

  async getDfrs() {
    const loader = await this.loadingController.create({
      message: 'Loading Daily Field Reports, One Moment.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.dfrService.getDFRListByDate(this.form.value.startDate, this.form.value.endDate).subscribe( (val: any) => {
        this.dfrs = val;
        loaderElement.remove();
      }, err => {
        loaderElement.remove();
      });
    });
  }


  viewDFR(item: DfrModel) {
    if (this.sharedService.isMobileDevice()) {
      this.router.navigate(['/', 'tabs', 'dfr', item._id]);
    } else {
      const url = this.router.createUrlTree(['/', 'tabs', 'dfr', item._id]);
      window.open(environment.appURL + url.toString(), '_blank');
    }
  }

  copyDFR(item: DfrModel) {
    const dfr: DfrModel = <DfrModel>item;
    this.dfrService.copyDFR(dfr._id).subscribe(val => {
       this.sharedService.showNotification('Daily Field Report, Rigs and Mud Copied');
       const newDfr = <DfrModel>val;
       this.dfrService.setCurrentDFR(newDfr);

       if (this.sharedService.isMobileDevice()) {
          this.router.navigate(['/', 'tabs', 'dfr', newDfr._id]);
        } else {
          const url = this.router.createUrlTree(['/', 'tabs', 'dfr', newDfr._id]);
          window.open(environment.appURL + url.toString(), '_blank');
        }
    });
  }

  async deleteDFR(item: string) {
    console.log( 'Delete Item: ' + item);
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this DFR',
      buttons: [
        {text: 'Yes',
        handler: (val) => {
          this.dfrService.deleteDFR(item).subscribe(val => {
              console.log ('Delete request complete');
              this.sharedService.showNotification('DFR Record Deleted');
              this.getDfrs();
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

    return await popover.present();
  }

  updateDate(data) {
    if (data.comp === 'startDate') {
      this.form.value.startDate = data.date;
    } else {
      this.form.value.endDate = data.date;
    }
  }

  boxChecked(dfrId) {
    if (!this.selectedIds.includes(dfrId)) {
      this.selectedIds.push(dfrId);
    } else {
      this.selectedIds.splice(this.selectedIds.indexOf(dfrId), 1);
    }
  }

  async itemSelected (val) {
    console.log (' item selected');
    console.log (val);
    if (this.selectedIds.length === 0) {
      this.sharedService.showNotification('At least one daily field report must be selected to create a field ticket.', 'danger', 2000);

    } else if (val === 'createFieldTicket') {
      const str = this.selectedIds.toString();
      this.createFieldTicket(str);

    } else if (val === 'createExcelDFR') {
      const str = this.selectedIds.toString();
      this.createExcelDFR(str);

    } else if (val === 'customFieldTicket') {
      const str = this.selectedIds.toString();
      this.router.navigate(['admin', 'fieldticketbuilder', 'id', str])
    }
  }

  async createFieldTicket (str) {
    const loader = await this.loadingController.create({
      message: 'Generating Field Ticket, One Moment Please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.fileSub = this.filesService.createDailyFieldTicket(str).subscribe((val: any) => {
          const filePath = val.data.filePath;
          const fileName = val.data.fileName;
  
          if (this.sharedService.isMobileDevice()) {
              this.openOnDevice(filePath, fileName);
          } else {
            window.open(filePath, '_blank');
          }
          loaderElement.remove();
          this.fileSub.unsubscribe();
          }, (err) => {
            this.sharedService.showNotification('Error generating field ticket.  Please check all the information in the daily field report.', 'danger', 2000);
          });
    });
  }

  async createExcelDFR(str) {
    const loader = await this.loadingController.create({
      message: 'Creating DFR Excel Document, One Moment Please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.fileSub = this.filesService.createExcelDFR(str).subscribe((val: any) => {
          const filePath = val.data.filePath;
          const fileName = val.data.fileName;

          if (this.sharedService.isMobileDevice()) {
              this.openOnDevice(filePath, fileName);
          } else {
            window.open(filePath, '_blank');
          }
          loaderElement.remove();
          this.fileSub.unsubscribe();
        }, (err) => {
          this.sharedService.showNotification('Error generating daily field report.  Please check all the information in the daily field report.', 'danger', 2000);
          loaderElement.remove();
        });
    });
  }

  openOnDevice(filePath: string, fileName: string) {
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

}
