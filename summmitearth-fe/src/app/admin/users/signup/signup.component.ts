import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


import { ManageConfigService } from '../../manageconfig.service';
import { PopoverController, LoadingController, IonItemSliding, IonRefresher, IonInput} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthService } from '../auth.service';
import { UserModel } from '../user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  @ViewChild('confirmPassword', { static: true }) confirmPassword: IonInput;

  manageConfigService: ManageConfigService;
  form: FormGroup;
  viewWidth = 1000;
  forceValidated = false;
  isMobileDevice = true;

  userModel: UserModel;
  isConsultant = false;

  constructor(
    private manageconfig: ManageConfigService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private formBuilder: FormBuilder)
    {
      this.viewWidth = this.sharedService.getPlaformWidth();
      this.isMobileDevice = this.sharedService.isMobileDevice();
      this.createForm();
    }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(paramMap => {
      console.log ('paramMap.has')
      console.log (paramMap);
      if (paramMap.has('id')) {
        this.authService.getSingleUser(paramMap.get('id')).subscribe((val: any) => {
          this.userModel = val.data;
          this.setFormValues();
        });
        // Default boolean values to false on form
      } else {
        this.form.get('isTech').setValue(false);
        this.form.get('isAdmin').setValue(false);
        this.form.get('isActive').setValue(true);
        this.form.get('isConsultant').setValue(false);
        this.form.get('permissions').get('dwmChecklists').setValue(false);
        this.form.get('permissions').get('dfrPipelines').setValue(false);
        this.form.get('permissions').get('dwmCalculators').setValue(false);
        this.form.get('permissions').get('dwmMapsTech').setValue(false);
        this.form.get('permissions').get('dwmMapsAdmin').setValue(false);
        this.form.get('permissions').get('dfrRRRTech').setValue(false);
        this.form.get('permissions').get('dfrRRRAdmin').setValue(false);
      }
    });

  }

  createForm() {
    this.form = this.formBuilder.group({
      _id: new FormControl(null, {
        updateOn: 'blur',
      }),
      firstName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      emailAddress:  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      username:  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      password:  new FormControl(null, {
        updateOn: 'blur'
        //validators: [Validators.required, Validators.minLength(8)]
      }),
      cellPhone:  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      otherPhone:  new FormControl(null, {
        updateOn: 'blur'
      }),
      isTech:  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      isAdmin:  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      isActive:  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      isConsultant:  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      permissions: this.formBuilder.group({
        dwmChecklists:  new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dfrPipelines:  new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dwmCalculators: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dwmMapsTech: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dwmMapsAdmin: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dfrRRRTech: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dfrRRRAdmin: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),

      })
    });

  }

  isConsultantChanged(event) {
      console.log (event);
      console.log (event.detail.checked);
      this.isConsultant = event.detail.checked;
      if (event.detail.checked) {
        this.form.get('password').setValidators([Validators.required, Validators.minLength(8)]);
        //this.form.get('password').enable();
      } else {
        this.form.get('password').setValidators(null);
        //this.form.get('password').disable();
        
      }
      this.form.get('password').updateValueAndValidity();

  }

  setFormValues() {
    for (const i in this.form.controls) {
        if ( i !== 'password'  && this.userModel[i] !== undefined) {
          this.form.get(i).setValue(this.userModel[i]);
        } else  if ( i === 'isConsultant') {
          this.isConsultant = this.userModel[i];
          this.form.get(i).setValue(this.userModel[i]);
        }
    }



  }

  refreshPage(event: Event, refresher: IonRefresher) {
    
  }

  showHideFormErrors() {
     this.forceValidated = !this.forceValidated;
     this.sharedService.invalidateForm(this.form, this.forceValidated);
  }


  onSaveForm() {
    if (!this.form.valid && this.userModel === undefined) {
      this.sharedService.showNotification('Ensure all required fields are filled out before saving', 'danger', 2000);
    } else if (this.isConsultant && this.form.get('password').value === undefined || this.confirmPassword.value === undefined) {
      this.sharedService.showNotification('Passwords do not match. Account not saved', 'danger', 2000);
    } else if (this.isConsultant && this.form.get('password').value !== this.confirmPassword.value && this.userModel === undefined) {
        this.sharedService.showNotification('Passwords do not match. Account not saved', 'danger', 2000);
    } else {
      this.saveRecord();
     }
  }

  saveRecord() {
    if (this.userModel === undefined ) {
      this.onAddUser();
    } else {
      this.onUpdateUser();
    }
  }

  async onUpdateUser() {
    const loader = await this.loadingController.create({
      message: 'Updating User, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.authService.updateUser(this.form.value).subscribe( val => {
        loaderElement.remove();
        this.sharedService.showNotification('User Updated');
        this.form.markAsPristine();
        this.userModel = this.form.value;
        this.backToUsers();
      }, error => {
        loaderElement.remove();
        this.sharedService.showAlert('Error Saving User. Please ensure all value are set.');
      });
    });
  }

  async onAddUser() {
    const loader = await this.loadingController.create({
      message: 'Saving New User, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.authService.register(this.form.value).subscribe( val => {
        loaderElement.remove();
        this.sharedService.showNotification('New User Added');
        this.form.markAsPristine();
        this.form.get('password').setValue('');
        this.confirmPassword.value = '';
        this.userModel = this.form.value;
        this.backToUsers();
      }, error => {
        loaderElement.remove();
        this.sharedService.showAlert('Error Saving User. Please ensure all value are set.');
      });
    });
  }

  backToUsers() {
    this.router.navigate(['admin', 'users']);
  }

}
