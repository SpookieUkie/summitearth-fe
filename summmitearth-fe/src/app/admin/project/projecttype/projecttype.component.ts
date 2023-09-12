import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { ManageConfigService } from '../../manageconfig.service';
import { PopoverController, LoadingController, IonItemSliding, IonInput, IonCol, MenuController} from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectTypeModel } from '../projecttype.model';
import { ProjectLocationModel } from '../projectlocation.model';
import { SharedService } from 'src/app/shared/shared.service';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { CalendarpickerComponent } from 'src/app/shared/calendarpicker/calendarpicker.component';
import { Subscription } from 'rxjs';
import { FieldTicketOptionsModel } from '../../fieldticketoptions/fieldticketoptions.model';
import { FieldTicketOptionsFormModel } from '../fieldticketoptionsconfig/fieldticketoptions-form.model';
import { MenuItem } from 'primeng/api';
import { ClientsService } from '../../clients/clients.service';
import { GenericPickerComponent } from 'src/app/shared/genericpicker/genericpicker.component';
import { UserModel } from '../../users/user.model';


@Component({
  selector: 'app-project',
  templateUrl: './projecttype.component.html',
  styleUrls: ['./projecttype.component.scss'],
})
export class ProjectComponent implements OnInit {
  @ViewChild('startDate') startDate: IonInput;
  @ViewChild('endDate') endDate: IonInput;
  @ViewChild('locationEndDate') locationEndDate: IonInput;
  @ViewChildren(IonCol) endGrid: QueryList<IonCol>;
  
  form: FormGroup;
  projectTypeModel: ProjectTypeModel;
  list: any [];
  viewWidth = 0;
  disposalMethods: any[];
  sub: Subscription;

  isMobileDevice: Boolean;
  projectTypes : [];

  pickerOptions = {};
  items: MenuItem[];
  clients: any[];
  landTypes: any[];
  activeItem: MenuItem;
  showDispositions = false;

  constructor(
   private manageConfigService: ManageConfigService,
   private sharedService: SharedService,
   private staticListService: StaticlistService,
   private activatedRoute: ActivatedRoute,
   private router: Router,
   private popoverController: PopoverController,
   private loadingController: LoadingController,
   private clientsService: ClientsService,
   private formBuilder: FormBuilder) {
    this.isMobileDevice = this.sharedService.isMobileDevice();
  }

  ngOnInit() {

   
    this.form = new FormGroup({
      startDate: new FormControl(null, {
        updateOn: 'blur',
      }),
      endDate: new FormControl(null, {
        updateOn: 'blur',
      }),
      projectTypeLabel: new FormControl(null, {
        updateOn: 'blur',
      }),
      projectNumber: new FormControl(null, {
        updateOn: 'blur',
      }),
      clientName: new FormControl(null, {
        updateOn: 'blur',
      }),
      lsd: new FormControl(null, {
        updateOn: 'blur',
      }),
      landType: new FormControl(null, {
        updateOn: 'blur',
      }),
      dispositions: new FormControl(null, {
        updateOn: 'blur',
      }),

      fieldTicketOptions: this.formBuilder.array([])
    });
   

    this.manageConfigService.currentProjectType.asObservable().subscribe(val => {
      this.projectTypeModel = val;
      if (this.projectTypeModel === null) {
        this.backToProjectList();
      } else {
        this.list = this.projectTypeModel.locations;
        this.list.sort(function(val1, val2) {
          return val1.displayOrder - val2.displayOrder;
        });


        this.staticListService.getDisposalMethodList('pipeline').subscribe((data: any) => {
          this.disposalMethods = data;
          //this.sub.unsubscribe();
        }, (err) => '', () => '');


        this.activatedRoute.paramMap.subscribe(paramMap => {
          if (paramMap.has('id')) {
             if (this.projectTypeModel !== undefined && this.projectTypeModel !== null) {

                // Set Form Data
                if (this.projectTypeModel.fieldTicketOptions === null) {
                  this.projectTypeModel.fieldTicketOptions = new Array<FieldTicketOptionsModel>();
                }
                const controlFTO = <FormArray>this.form.controls.fieldTicketOptions;

                this.projectTypeModel.fieldTicketOptions.forEach(val2 => {
                  controlFTO.push(this.formBuilder.group(new FieldTicketOptionsFormModel(val2)));
                  //i++;
                });

              for (const i in this.form.controls) {
                 if (i === 'startDate' || i === 'endDate' ) {
                    if ( this.projectTypeModel[i] !== null) {
                      let val = this.projectTypeModel[i].toString();
                      this.form.get(i).setValue(val.substring(0, 10));
                    }
                 } else if ( i === 'landType') {
                    setTimeout(() => {
                      this.form.get(i).setValue(this.projectTypeModel[i]);
                    }, 100);
                 } else if (i !== '_id' && i !== 'fieldTicketOptions' && i !== 'startDate' && i !== 'endDate') {
                    this.form.get(i).setValue(this.projectTypeModel[i]);
                 }

                }
             }
          }
        });
      }
    });
  }

  ionViewWillEnter() {
    console.log ('project type enter');
    this.getStaticLists();
  }

  getStaticLists() {
    this.staticListService.getListTypeForAny('projectType').subscribe(val => {
      this.projectTypes = val;
     }, (err) => '', () => '');

     this.staticListService.getListTypeForRRR('landType').subscribe(val => {
      this.landTypes = val;
      
     }, (err) => '', () => '');

     this.clientsService.getClientsInList().subscribe((val: any) => {
       this.clients = val;
       console.log ('clients');
       console.log (this.clients);
     }, (err) => '', () => '');
  }


  ionViewWillLeave() {
    console.log("VIEW DID LEAVE");
    const controlFTO = <FormArray>this.form.controls.fieldTicketOptions;
    let i = 0;
    for (i = controlFTO.length - 1; i >= 0; i--) {
      controlFTO.removeAt(i);
    }
  }

  get fieldTicketOptions(): FormArray {
    if (this.form) {
        return this.form.get('fieldTicketOptions') as FormArray;
    }
  }


  // Check hack to allow the start date to be set and be used as a filter for the end date.
  addLocation() {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10) + '_new';
    const m = new ProjectLocationModel(id, null, new Date(), null, true, this.list.length);
    let n = {};
    n = m;
    n['startDate'] = new Date(n['startDate']).toISOString();
    this.list.push(n);
  }

  // Note display order will be starting at 1, the index for sorting list is 0
  itemsReordered(event) {
    // Update current item.
    let id = '';
    this.list.forEach(element => {
      console.log (element.displayOrder);
      if (element.displayOrder === event.detail.from) {
         element.displayOrder = event.detail.to;
         id = element._id;
      }
    });

    // Update order of effected items
    this.list.forEach(element => {
      if (event.detail.from < event.detail.to) {
        if (element.displayOrder >= event.detail.from && element.displayOrder <= event.detail.to) {
          if (element.displayOrder >= event.detail.from && element._id !== id) {
            element.displayOrder = element.displayOrder - 1;
          } else if (element.displayOrder <= event.detail.to && element._id !== id) {
            element.displayOrder = element.displayOrder + 1;
          }
        }
      } else {
        if (element.displayOrder >= event.detail.to && element.displayOrder <= event.detail.from) {
          if (element.displayOrder >= event.detail.to && element._id !== id) {
            element.displayOrder = element.displayOrder + 1;
          } else if (element.displayOrder <= event.detail.from && element._id !== id) {
            element.displayOrder = element.displayOrder - 1;
          }
        }

      }
    });

    this.list.sort(function(val1, val2) {
      return val1.displayOrder - val2.displayOrder;
    });
    event.detail.complete();
  }

  backToProjectList() {
    this.router.navigate(['admin', 'project']);
  }

  updateDate(data) {
    const i = data.pos;
    if (i === '-1') {
      this.projectTypeModel[data.comp] = data.date;
    } else {
      const valToUpdate = this.list[i];
      valToUpdate[data.comp] = data.date;
    }
  }

  disposalChanged(d, event) {
    d.isActive = !d.isActive;
  }

  landTypeChange(event) {
    console.log (event.detail.value);
    const val = event.detail.value;
    if (val === 'Crown') {
      this.showDispositions = true;
    } else {
      this.showDispositions = false;
    }
  }

  async saveProject() {
    // Check if project types have been saved
    if (this.projectTypeModel.disposalMethods === null || this.projectTypeModel.disposalMethods.length < 1 ) {
      this.disposalMethods.forEach((val: any) => {
        this.projectTypeModel.disposalMethods.push({disposalMethod: val.value, isActive: false});
      });
    }

    const loader = await this.loadingController.create({
      message: 'Saving Project Configuration, one moment please.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();

      if (this.projectTypeModel.projectType === 'epmDFR') {
          this.list.forEach(element => {
            if (element.hasOwnProperty('_id') && element._id.indexOf('_new') !== -1) {
              delete element._id;
            }
          });
          this.projectTypeModel.locations = this.list;
          // Can't change
          //this.projectTypeModel.projectNumber = this.form.value.projectNumber;
          //this.projectTypeModel.projectTypeLabel = this.form.value.projectTypeLabel;
          this.projectTypeModel.fieldTicketOptions = this.form.value.fieldTicketOptions;
      } else {
        this.projectTypeModel.clientName = this.form.get('client').value;
        this.projectTypeModel.landType = this.form.get('landType').value;
        this.projectTypeModel.lsd = this.form.get('lsd').value;
        this.projectTypeModel.dispositions = this.form.get('dispositions').value;
      }



      this.manageConfigService.updateProject(this.projectTypeModel).subscribe(val => {
        console.log (val);
        loaderElement.dismiss();
        this.sharedService.showNotification('Project Configuration Saved');
        //this.backToProjectList();
      }, (err => {
        this.sharedService.showNotification('Error: ' + err.error.message, 'danger');
        loaderElement.dismiss();
        console.log (err.error.message);
      }));
    });
  }

  async presentGenericPopover(event) {
    const popover = await this.popoverController.create({
        component: GenericPickerComponent,
       // event: event,
        cssClass: 'genericPickerPopover',
        translucent: true,
        componentProps: {
          
          currentValue: this.form.get('client').value,
          currentList: this.clients,
          currentItem: null,
          filterBy: 'clientName',
          pickerTitle: 'Selected Client'
          
        }
      });
    popover.onDidDismiss().then(val => {
      console.log (val);
      console.log ('Picker Dismissed');
        if (val.data !== undefined) {
          const item =  val.data;
          this.form.get('client').setValue(item.clientName);
          this.form.markAsDirty();
        }
    });
    return await popover.present();
  }

}
