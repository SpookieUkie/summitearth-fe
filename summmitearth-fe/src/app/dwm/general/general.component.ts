import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, PopoverController, LoadingController, IonRefresher, IonInput } from '@ionic/angular';
import { AuthService } from 'src/app/admin/users/auth.service';
import { UserModel } from 'src/app/admin/users/user.model';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TechpickerComponent } from 'src/app/shared/techpicker/techpicker.component';
import { GeneralService } from './general.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
})
export class GeneralComponent implements OnInit {

  form: FormGroup;
  viewWidth = 1000;
  forceValidated = false;
  isMobileDevice = false;

  userList: any[];
  filteredUserList: any[];
  currentRec;
  comboList = ['tech1Name', 'tech2Name'];

  constructor(
    private router: Router,
    private menuController: MenuController,
    private cacheSaveDataService: CacheSaveDataService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {

    //this.currentUser = this.navParams.get('currentUser');
    this.authService.getAllUsers().subscribe((list: any) => {

      this.userList = list.data;
      this.filteredUserList = list.data;
    }, (err) => '', () => '');

    this.initForm();
  }


  initForm() {
    this.generalService.getCurrentGenForm().subscribe((val: any) => {
      this.form = val;
      console.log ('got form');
    }, (err) => '', () => '');

    this.generalService.getCurrentGen().subscribe((val: any) => {
      this.currentRec = val;
      this.setFormValues();
      //console.log ('got form');
    }, (err) => '', () => '');


  }

  setFormValues() {
    for (const i in this.form.controls) {
     if (i === 'tech1Name' || i === 'timeOfInspection' || i === 'clientName') {
          setTimeout(() => {
          if (this.currentRec[i] !== undefined) {
            this.form.get(i).setValue(this.currentRec[i]);
          }
          }, 5);
      } else {
        if (this.currentRec[i] !== undefined) {
          this.form.get(i).setValue(this.currentRec[i]);
        }
      }
    }
    console.log ('done form');
    if (this.currentRec._id === null || this.currentRec._id === undefined) {
      if (this.cacheSaveDataService.status.connected) {
        setTimeout(() => {
          this.onSaveForm();
        }, 2000);
      }
    }
  }

  backToList() {
    this.router.navigate(['dwm']);
  }

  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }

  async onSaveForm() {
    console.log (this.form);

    

    /*if (this.form.value.reportStatus === null) {
      this.form.value.reportStatus = 'Open';
    }*/
    //this.form.get('naNotes').setValue(this.dailyAuditDwmService.dailyAuditDWMModel$.value.naNotes);
    // Save date as utc
    // No longer works, reverts to last value for some reason
    //this.form.value.inspectionDate = moment.utc(this.form.value.inspectionDate).format();
    //this.form.value.inspectionDate = moment.utc(this.dailyAuditDwmModel.inspectionDate).format();
    this.form.value._id = this.currentRec._id;
    try {
        const loader = await this.loadingController.create({
        message: 'Saving Job Information, one moment please.',
          animated: true
        }).then(loaderElement => {
          loaderElement.present();
          this.generalService.saveReport(this.form.value).subscribe( val => {
            loaderElement.remove();
            this.sharedService.showNotification('General Information Saved');
            this.form.markAsPristine();
            this.generalService.getCurrentGen = val ;//this.form.value;
            this.form.get('_id').setValue(val._id);
          }, error => {
            console.log ('error connection');
            console.log (error);
            loaderElement.remove();
            this.sharedService.showNotification('Error Saving Job Information', 'danger');
          });
      });
    } catch (error) {
      console.log ('error 2');
    }
  }

  refreshPage(event: any, refresher: IonRefresher) {
    refresher.complete();
  }

}
