import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRefresher, IonInput } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-napprates',
  templateUrl: './napprates.component.html',
  styleUrls: ['./napprates.component.scss'],
})

export class NappratesComponent implements OnInit {
  viewWidth = 1000;
  form: FormGroup;
  sharedService: SharedService;
  router: Router;

  constructor(
    router: Router,
    sharedService: SharedService
    ) {
      this.router = router;
      this.sharedService = sharedService;
      this.viewWidth = this.sharedService.getPlaformWidth();
    }

  ngOnInit() {
    this.setupForm();
  }

  refreshPage(event: any, refresher: IonRefresher) {
    refresher.complete();
  }

  setupForm () {
    this.form = new FormGroup({
      unitsAdded: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      massOfUnit: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      nInProduct: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      disposalArea: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      volume: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      sprayRate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      nApplicationRate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }


  onValChange() {

    if (this.form.get('volume').value !== '' && this.form.get('volume').value !== null &&
        this.form.get('sprayRate').value !== '' && this.form.get('sprayRate').value !== null) {
        this.form.get('disposalArea').setValue (Number(this.form.get('volume').value / this.form.get('sprayRate').value));
    }

    if (this.form.get('unitsAdded').value !== '' && this.form.get('unitsAdded').value !== null &&
    this.form.get('massOfUnit').value !== '' && this.form.get('massOfUnit').value !== null &&
    this.form.get('nInProduct').value !== '' && this.form.get('nInProduct').value !== null &&
    this.form.get('volume').value !== '' && this.form.get('volume').value !==null &&
    this.form.get('sprayRate').value !== '' && this.form.get('sprayRate').value !== null) {
      const a = Number(this.form.get('unitsAdded').value * this.form.get('massOfUnit').value * this.form.get('nInProduct').value)
      const b = Number(this.form.get('disposalArea').value * 100);
      this.form.get('nApplicationRate').setValue (a / b);
    }

  }

  getClass() {
    if (this.form.get('nApplicationRate').value !== '' && this.form.get('nApplicationRate').value !== null) {
      if (this.form.get('nApplicationRate').value > 25) {
        return 'calOver';
      } else {
        return 'calUnder';
      }
    } else {
      return 'readonly';
    }
  }

  backToList() {
    this.router.navigate(['calculators']);
  }

  clearForm() {
    for (const i in this.form.controls) {
      this.form.get(i).setValue('');
    }
    this.sharedService.invalidateForm(this.form, false);
  }
}
