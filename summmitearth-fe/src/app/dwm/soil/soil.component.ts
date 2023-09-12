import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, PopoverController, LoadingController, IonRefresher, IonInput } from '@ionic/angular';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { SharedService } from 'src/app/shared/shared.service';
import { TechpickerComponent } from 'src/app/shared/techpicker/techpicker.component';
import { SoilService } from './soil.service';

@Component({
  selector: 'app-soil',
  templateUrl: './soil.component.html',
  styleUrls: ['./soil.component.scss'],
})
export class SoilComponent implements OnInit {

  form: FormGroup;
  viewWidth = 1000;
  forceValidated = false;
  isMobileDevice = false;

  constructor(
    private router: Router,
    private menuController: MenuController,
    private cacheSaveDataService: CacheSaveDataService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private soilService: SoilService,
   
  ) { }

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
    this.soilService.getCurrentGenForm().subscribe((val: any) => {
      this.form = val;
      console.log ('got form');
    }, (err) => '', () => '');


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
        message: 'Saving Soil Information, one moment please.',
          animated: true
        }).then(loaderElement => {
          loaderElement.present();
          this.soilService.saveReport(this.form.value).subscribe( val => {
            loaderElement.remove();
            this.sharedService.showNotification('Land Information Saved');
            this.form.markAsPristine();
            this.soilService.getCurrentGen = val ;//this.form.value;
            this.form.get('_id').setValue(val._id);
          }, error => {
            console.log ('error connection');
            console.log (error);
            loaderElement.remove();
            this.sharedService.showNotification('Error Saving Soil Information', 'danger');
          });
      });
    } catch (error) {
      console.log ('error 2');
    }
  }


  backToList() {
    this.router.navigate(['welcome']);
  }

  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }


}
