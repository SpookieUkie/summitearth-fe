
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, IonItemSliding, IonRefresher, AlertController, PopoverController, LoadingController } from '@ionic/angular';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription, Observable } from 'rxjs';
import { UserModel } from 'src/app/admin/users/user.model';
import { AuthService } from 'src/app/admin/users/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SortEvent } from 'primeng/api';
import { DfrService } from 'src/app/dfr/dfr.service';
import { DfrModel } from 'src/app/dfr/dfr-model';
import { CalendarpickerComponent } from 'src/app/shared/calendarpicker/calendarpicker.component';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClientModel } from '../client.model';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  viewWidth = 1000;
  clientModel: ClientModel;
  form: FormGroup;
  sub: Subscription;
  forceValidated: Boolean;
  isMobileDevice = true;

  constructor(
    private menuController: MenuController,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private clientsService: ClientsService,
    private authService: AuthService,
    private dfrService: DfrService,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router
    ) {
    this.isMobileDevice = this.sharedService.isMobileDevice();
   }

  ngOnInit() {
    this.form = new FormGroup({
      _id: new FormControl(null, {
        updateOn: 'blur',
      }),
      clientName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
        updateOn: 'blur',
      }),
      city:  new FormControl(null, {
        updateOn: 'blur',
      }),
      province:  new FormControl(null, {
        updateOn: 'blur',
      }),
      postalCode:  new FormControl(null, {
        updateOn: 'blur',
      }),
      emailAddress:  new FormControl(null, {
        updateOn: 'blur',
      }),
      mainPhone:  new FormControl(null, {
        updateOn: 'blur',
      }),
      cellPhone:  new FormControl(null, {
        updateOn: 'blur'
      }),
      keyContact:  new FormControl(null, {
        updateOn: 'blur',
      }),
      isActive:  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      clientGroup:  new FormControl(null, {
        updateOn: 'blur',
      })
    });

    this.activatedRoute.paramMap.subscribe(paramMap => {
      console.log ('paramMap.has')
      console.log (paramMap);
      if (paramMap.has('id')) {
        this.clientsService.getSingleClient(paramMap.get('id')).subscribe((val: any) => {
          this.clientModel = val.data;
          this.setFormValues();
        });
      } else {
        this.form.get('isActive').setValue(true);
      }
    });

  }

  setFormValues() {
    for (const i in this.form.controls) {
        this.form.get(i).setValue(this.clientModel[i]);
    }
  }

  onSaveForm() {
    if (this.clientModel === undefined ) {
      this.onAddClient();
    } else {
      this.onUpdateClient();
    }
  }

  async onUpdateClient() {
    const loader = await this.loadingController.create({
      message: 'Updating Client, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.sub = this.clientsService.updateClient(this.form.value).subscribe( val => {
        loaderElement.remove();
        this.sharedService.showNotification('Client Updated');
        this.form.markAsPristine();
        this.clientModel = this.form.value;
        this.sub.unsubscribe();
        this.router.navigate(['admin', 'clients']);
      }, error => {
        loaderElement.remove();
        this.sharedService.showAlert('Error Saving Client. Please ensure all value are set.');
      });
    });
  }

  async onAddClient() {
    const loader = await this.loadingController.create({
      message: 'Saving New Client, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.sub = this.clientsService.saveClient(this.form.value).subscribe((val: any) => {
        loaderElement.remove();
        this.sharedService.showNotification('New Client Added');
        this.form.markAsPristine();
        this.sub.unsubscribe();
        this.backToClientList();
      }, error => {
        loaderElement.remove();
        this.sharedService.showAlert('Error Saving Client. Please ensure all value are set.');
      });
    });
  }

  backToClientList() {
    this.router.navigate(['admin', 'clients']);
  }

  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }

}
