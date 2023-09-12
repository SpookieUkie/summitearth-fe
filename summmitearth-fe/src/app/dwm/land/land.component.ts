import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, PopoverController, LoadingController, IonRefresher, IonInput } from '@ionic/angular';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TechpickerComponent } from 'src/app/shared/techpicker/techpicker.component';
import { GeneralService } from '../general/general.service';
import { LandService } from './land.service';


@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.scss'],
})
export class LandComponent implements OnInit {
  
  form: FormGroup;
  viewWidth = 1000;
  forceValidated = false;
  isMobileDevice = false;
  jobId;
  list: [];

  constructor(
    private router: Router,
    private menuController: MenuController,
    private cacheSaveDataService: CacheSaveDataService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private landService: LandService,
   
  ) { 
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
          this.jobId = paramMap.get('id');
          console.log (this.jobId);
      };
    }, (err) => '', () => '');
  }

  ngOnInit() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    if (this.form === undefined || this.form === null) {
      this.initForm();
      //this.prepareForm();
    }
  }

  initForm() {
    this.landService.getCurrentGenForm().subscribe((val: any) => {
      this.form = val;
      console.log ('got form');
    }, (err) => '', () => '');

    this.landService.getCurrentList(this.jobId).subscribe((val: any) => {
      this.list = val;
      console.log ('got land list');
      console.log(this.list);
    }, (err) => console.log('Error on land list'), () => '');

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
    try {
        const loader = await this.loadingController.create({
        message: 'Saving Land Information, one moment please.',
          animated: true
        }).then(loaderElement => {
          loaderElement.present();
          this.landService.saveReport(this.form.value).subscribe( val => {
            loaderElement.remove();
            this.sharedService.showNotification('Land Information Saved');
            this.form.markAsPristine();
            this.landService.getCurrentGen = val ;//this.form.value;
            this.form.get('_id').setValue(val._id);
          }, error => {
            console.log ('error connection');
            console.log (error);
            loaderElement.remove();
            this.sharedService.showNotification('Error Saving Land Information', 'danger');
          });
      });
    } catch (error) {
      console.log ('error 2');
    }
  }

  loadLand() {

  }

  backToList() {
    this.router.navigate(['welcome']);
  }

  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }


}
