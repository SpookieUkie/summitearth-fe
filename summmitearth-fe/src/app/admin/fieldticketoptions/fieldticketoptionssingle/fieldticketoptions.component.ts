import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PopoverController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../users/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { FieldticketoptionsService } from '../fieldticketoptions.service';
import { FieldTicketOptionsModel } from '../fieldticketoptions.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fieldticketoptions',
  templateUrl: './fieldticketoptions.component.html',
  styleUrls: ['./fieldticketoptions.component.scss'],
})
export class FieldticketoptionsComponent implements OnInit {

  form: FormGroup;
  fieldTicketOptionsModel: FieldTicketOptionsModel;
  sub: Subscription;
  viewWidth = 576;
  forceValidated: Boolean;
  isMobileDevice = true;
  linkedToProject = false;

  constructor(
      private authService: AuthService,
      private sharedService: SharedService,
      private popoverController: PopoverController,
      private loadingController: LoadingController,
      private alertController: AlertController,
      private activatedRoute: ActivatedRoute,
      private navController: NavController,
      private fieldticketoptionsService: FieldticketoptionsService,
      private router: Router,
  ) {
      this.isMobileDevice = this.sharedService.isMobileDevice();
   }

  ngOnInit() {

    this.form = new FormGroup({
      _id: new FormControl(null, {
        updateOn: 'blur',
      }),
      chargeLabel: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      unitType: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      defaultQty: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      clientCost: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      qtyIncluded: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      equipmentCost: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      percentMarkup: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      showByDefault: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      linkedToTech: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      isActive: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
   // this.ionViewWillEnter();
  }

 
ionViewWillEnter() {

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.fieldticketoptionsService.getSingleFieldTicketOption(paramMap.get('id')).subscribe((val: any) => {
          this.fieldTicketOptionsModel = val.data;
          this.setFormValues();
        });
      } else {
        this.form.get('isActive').setValue(true);
      }
    });
 
}

addItem() {

}

 showTopMenu() {

 }


setFormValues() {
  for (const i in this.form.controls) {
      this.form.get(i).setValue(this.fieldTicketOptionsModel[i]);
  }
}

  backToFTOList() {
    this.router.navigate(['admin', 'fieldticketoptions']);
  }

  onSaveForm() {
    if (this.fieldTicketOptionsModel === undefined ) {
      this.onAddFTO();
    } else {
      this.onUpdateFTO();
    }
  }

  async onUpdateFTO() {
    const loader = await this.loadingController.create({
      message: 'Updating Field Ticket Option, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.sub = this.fieldticketoptionsService.updateFieldTicketOption(this.form.value).subscribe( val => {
        loaderElement.remove();
        this.sharedService.showNotification('Field Ticket Option Updated');
        this.form.markAsPristine();
        this.fieldTicketOptionsModel = this.form.value;
        this.sub.unsubscribe();
        this.router.navigate(['admin', 'fieldticketoptions']);
      }, error => {
        loaderElement.remove();
        this.sharedService.showAlert('Error Saving Field Ticket Option. Please ensure all value are set.');
      });
    });
  }

  async onAddFTO() {
    //Set default values
    this.form.value.section = 'Main';
    this.form.value.group = 'Pipeline';

    const loader = await this.loadingController.create({
      message: 'Saving New Field Ticket Option, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.sub = this.fieldticketoptionsService.saveFieldTicketOption(this.form.value).subscribe((val: any) => {
        loaderElement.remove();
        this.sharedService.showNotification('New Field Ticket Option Added');
        this.form.markAsPristine();
        this.sub.unsubscribe();
        this.router.navigate(['admin', 'fieldticketoptions']);
      }, error => {
        loaderElement.remove();
        this.sharedService.showAlert('Error Saving Field Ticket Option. Please ensure all value are set.');
      });
    });
  }


  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }


}
