import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { BreadcrumbService } from 'src/app/breadcrumb.service';


@Component({
  selector: 'app-dfrlist',
  templateUrl: './dfrlist.component.html',
  styleUrls: ['./dfrlist.component.scss'],
})
export class DfrlistComponent implements OnInit {

  breadcrumbService: BreadcrumbService;

  constructor(breadcrumbService: BreadcrumbService) {
     breadcrumbService.setItems([
      {label: 'DFR'}
    ]);
   }
  form;
  ngOnInit() {
   /* this.currentDFRSub = this.dfrService.getCurrentDFR().subscribe(val => {
      this.currentDFR = val;
    });*/
   

    this.form = new FormGroup({
        _id: new FormControl(null, {
          updateOn: 'blur',
        }),
        projectName: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        projectNumber: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(15)]
        }),
        projectType: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dfrDate: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        projectLocation: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        superIntendent: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        enviroLead: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        summitProjectManager: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        client: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        solidsDisposalMethod: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        liquidsDisposalMethod: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        contactInformation: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        installedPipeSize: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        reamingProgression: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        currentWeather: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        forecastWeather: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        summitFieldRepresentative: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        summitFieldContactInformation: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        hoursOfWork: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dfrStatus: new FormControl(null, {
          updateOn: 'blur'
        })
      });



  }

}
