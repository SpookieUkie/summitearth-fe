import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, AlertController, IonItemSliding, IonRefresher, IonList, NavController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CameraPhoto } from '@capacitor/core';
import { SharedService } from '../shared/shared.service';
import { StaticlistService } from '../shared/staticlist.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../admin/users/auth.service';
import { ManageConfigService } from '../admin/manageconfig.service';
import { GeneralModel } from './general/general.model';
import { GeneralService } from './general/general.service';

@Component({
  selector: 'app-dwm',
  templateUrl: './dwm.page.html',
  styleUrls: ['./dwm.page.scss'],
})
export class DwmPage implements OnInit {
  @ViewChild('slidingItem') slidingItem: IonItemSliding;
  @ViewChild('ionSlidingList', { static: true }) ionSlidingList: IonList;


  list: any[];
  //currentDFR: any;
  //currentDFRSub: Subscription;


  form: FormGroup;
  isPhone = false;
  viewWidth = 0;
  currentUser;

  constructor( private sharedService: SharedService,
    private authService: AuthService,
    private manageConfigService: ManageConfigService,
    private staticListService: StaticlistService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navController: NavController,
    private router: Router,
    private generalService: GeneralService) {
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

    let val1 = new Date();
    val1 = this.sharedService.resetTime(val1);

    let val2 = new Date();
    val2.setDate(val1.getDate() - 7);
    this.sharedService.resetTime(val2);
    this.form.get('startDate').setValue(val2.toISOString());
    this.form.get('endDate').setValue(val1.toISOString());
    this.form.updateValueAndValidity();
    console.log('ng init');
    this.getList();

  }


  refreshPage(event: any, refresher: IonRefresher) {
    //this.getDFRList();
    refresher.complete();
  }

  async getList() {
    let val1 = this.form.value.startDate;
    let val2 = this.form.value.endDate;
    this.list = [];
    this.currentUser._id = '5d10fe4010f6f8fbbfcd78e8';
    if (val1 !== null && val2 !== null) {
      const loader = await this.loadingController.create({
        message: 'Loading Jobs, One Moment.',
        animated: true
      }).then(loaderElement => {
        loaderElement.present();
        //this.generalService.getJobListByDateAndAssignedToUserId(val1, val2, this.currentUser._id).subscribe( val => {
        this.generalService.getJobListByDateAndAssignedToTechId(val1, val2, this.currentUser._id).subscribe( val => {
          this.list = val;
          loaderElement.remove();
        }, err => {
          loaderElement.remove();
        }, () => '');
      });
    }
  }

  editItem(item: any, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.itemClicked(item);
  }

  deleteItem(item: any, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.itemClicked(item);
  }


  copyItem(item: any, slidingItem: IonItemSliding) {
    slidingItem.close();
    const job: GeneralModel = <GeneralModel>item;

  /* this.dfrRRRservice.copyDFR(dfr._id).subscribe(val => {
      this.sharedService.showNotification('Daily Field Report Copied');
      const newDfr = <DfrRRRModel>val;
      this.dfrRRRservice.setCurrentDFR(newDfr);
      this.dfrList.push(newDfr);
      this.goToDFR(newDfr._id);
    });  */
    console.log ('Copy Job');
  }

  itemClicked(item) {
    if (item.jobStatus !== 'Submitted' || this.currentUser.isAdmin ) {
          this.generalService.setCurrentGen(item);
          this.sharedService.showNotification('Current Job Loaded');
          this.goToJob(item);
    } else {
      this.sharedService.showNotification('This Job is already submitted and cannot be changed', 'danger', 2500);
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

  goToJob(item) {
    this.generalService.setCurrentGen(item);
    this.router.navigate( ['dwm', item._id, 'general']);
  }

  newJob(item) {
    this.router.navigate( ['dwm', 'newjob']);
  }

}
