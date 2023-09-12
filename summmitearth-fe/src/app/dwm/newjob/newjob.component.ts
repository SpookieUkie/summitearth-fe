import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, PopoverController, LoadingController, IonRefresher, IonInput } from '@ionic/angular';
import { AuthService } from 'src/app/admin/users/auth.service';
import { UserModel } from 'src/app/admin/users/user.model';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TechpickerComponent } from 'src/app/shared/techpicker/techpicker.component';
import { GeneralModel } from '../general/general.model';
import { GeneralService } from './../general/general.service';

@Component({
  selector: 'app-newjob',
  templateUrl: './newjob.component.html',
  styleUrls: ['./newjob.component.scss'],
})
export class NewJobComponent implements OnInit {

  form: FormGroup;
  viewWidth = 1000;
  forceValidated = false;
  isMobileDevice = false;

  userList: any[];
  filteredUserList: any[];
  currentRec: GeneralModel;

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
    this.generalService.getNewGenForm().subscribe((val: any) => {
      this.form = val;
      console.log ('got form');
    }, (err) => '', () => '');


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
    this.currentRec = new GeneralModel();
    this.currentRec.setDefaults();
    for (const i in this.form.value) {
        //if (this.dfrRRRModel[i] !== undefined) {
          this.currentRec[i] = this.form.value[i];
         // this.form.get(i).setValue(this.dfrRRRModel[i]);
       // }
      //}
    }
    /*if (this.form.value.reportStatus === null) {
      this.form.value.reportStatus = 'Open';
    }*/
    //this.form.get('naNotes').setValue(this.dailyAuditDwmService.dailyAuditDWMModel$.value.naNotes);
    // Save date as utc
    // No longer works, reverts to last value for some reason
    //this.form.value.inspectionDate = moment.utc(this.form.value.inspectionDate).format();
    //this.form.value.inspectionDate = moment.utc(this.dailyAuditDwmModel.inspectionDate).format();
    
    try {
        const loader = await this.loadingController.create({
        message: 'Saving  New Job Information, one moment please.',
          animated: true
        }).then(loaderElement => {
          loaderElement.present();
          this.generalService.saveReport(this.currentRec).subscribe( val => {
            loaderElement.remove();
            this.sharedService.showNotification('New Job Saved');
            this.form.markAsPristine();
            this.generalService.setCurrentGen(val) ;//this.form.value;
            this.router.navigate(['dwm', val._id, 'general' ])
            //this.form.get('_id').setValue(val._id);
          }, error => {
            console.log ('error connection');
            console.log (error);
            loaderElement.remove();
            this.sharedService.showNotification('Error Saving New Job Information', 'danger');
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
