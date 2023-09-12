import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ManageConfigService } from '../../manageconfig.service';
import { PopoverController, LoadingController, IonItemSliding, IonRefresher, IonInput} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-muditem',
  templateUrl: './muditem.component.html',
  styleUrls: ['./muditem.component.scss'],
})
export class MuditemComponent implements OnInit {
  form: FormGroup;
  viewWidth = 1000;
  forceValidated = false;
  isMobileDevice = true;

  mudModel: any = {};
  sub: Subscription[] = [];

  constructor(
    private manageconfig: ManageConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private staticlistService: StaticlistService) {
      this.viewWidth = this.sharedService.getPlaformWidth();
      this.isMobileDevice = this.sharedService.isMobileDevice();
      this.createForm();
    }


  ngOnInit() {
    

  }

  ionViewWillEnter() {
    if (this.staticlistService.isMudListNull()) {
      this.backToMudList();

    } else {
      this.activatedRoute.paramMap.subscribe(paramMap => {
        console.log (paramMap);
        if (paramMap.has('id')) {
          this.staticlistService.getMudProductsList().subscribe (muds => {
              this.staticlistService.getSingleMudProduct(paramMap.get('id')).subscribe((val: any) => {
                console.log (val);
                this.mudModel = val;
                this.setFormValues();
              });
          }, err => {
            this.backToMudList();
          });
        }
        () => '';
      });
    }
  }

  ionViewWillLeave() {

  }


  refreshPage(event: any, refresher: IonRefresher) {
    refresher.complete();
  }


  createForm() {
    this.form = this.formBuilder.group({
      _id: new FormControl(null, {
        updateOn: 'blur',
      }),
      mudProductName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      defaultUnitSize: new FormControl(null, {
        updateOn: 'blur',
      }),
      defaultUnitType: new FormControl(null, {
        updateOn: 'blur',
      }),
      mtoxThreshold: new FormControl(null, {
        updateOn: 'blur',
      })
    });
  }

  setFormValues() {
    // tslint:disable-next-line: forin
    for (const i in this.form.controls) {
        this.form.get(i).setValue(this.mudModel[i]);
    }
  }

  backToMudList() {
    this.router.navigate(['admin', 'muds']);
  }

  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
 }

  onSaveForm() {
    // Validate Mud Product Name
    const id =  this.form.get('_id').value;
    if (!this.form.valid && this.mudModel === undefined) {
      this.sharedService.showNotification('Ensure all required fields are filled out before saving', 'danger', 2000);
    } else {
      this.staticlistService.getMudProductByNameAndId(this.form.get('mudProductName').value).subscribe (val => {
        if (val.length > 0  && id === null) {
          this.sharedService.showNotification('Product Name Already in System', 'danger', 2000);
        } else if (val.length > 1)  {
          this.sharedService.showNotification('Product Name Already in System', 'danger', 2000);
        } else if (val.length === 1 && val[0]._id !== id)  {
          this.sharedService.showNotification('Product Name Already in System', 'danger', 2000);
        } else {
          //save product
          if (id === null || id === undefined) {
            this.addMud();
          } else {
            this.updateMud();
          }
        }
      },
      () => '');
    }
  }

  async addMud() {
    const loader = await this.loadingController.create({
      message: 'Saving New Mud, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.staticlistService.addMudProduct(this.form.value).subscribe( val => {
        loaderElement.remove();
        this.sharedService.showNotification('New Mud Added');
        this.form.markAsPristine();
        this.backToMudList();
      }, error => {
        loaderElement.remove();
        this.sharedService.showAlert('Error Saving Mud. Please ensure all value are set.');
      }, () => '' );
    });
  }

  async updateMud() {
    const loader = await this.loadingController.create({
      message: 'Updating Mud, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.staticlistService.updateMudProduct(this.form.value).subscribe( val => {
        loaderElement.remove();
        this.sharedService.showNotification('Mud Updated');
        this.form.markAsPristine();
        this.backToMudList();
      }, error => {
        loaderElement.remove();
        this.sharedService.showAlert('Error Saving Mud. Please ensure all value are set.');
      }, () => '');
    });
  }
}
