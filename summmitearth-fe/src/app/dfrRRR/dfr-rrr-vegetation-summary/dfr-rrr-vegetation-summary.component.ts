import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController, PopoverController, LoadingController, IonRefresher, IonInput } from '@ionic/angular';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { SharedService } from 'src/app/shared/shared.service';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { GenericPhotoService } from 'src/app/shared/genericphoto/genericphoto.service';
import { FilesService } from 'src/app/shared/genericfile/genericfile.service';
import { ClientsService } from 'src/app/admin/clients/clients.service';
import { DfrRRRService } from '../dfr-rrr.service';
import { DfrRRRModel } from '../dfr-rrr.model';
import { DfrRRRFormModel } from '../dfr-rrr-form.model';

@Component({
  selector: 'app-dfr-rrr-vegetation-summary',
  templateUrl: './dfr-rrr-vegetation-summary.component.html',
  styleUrls: ['./dfr-rrr-vegetation-summary.component.scss'],
})
export class DfrRrrVegetationSummaryComponent implements OnInit {
  @ViewChild('dfrDate') dfrDate: IonInput;

  form: FormGroup;
  viewWidth = 1000;
  forceValidated = false;
  genericIdType = 'rrrDFR';
  genericId = '';
  isMobileDevice = false;
  dfrRRRModel: DfrRRRModel;
  dfrRRRFormModel: DfrRRRFormModel;

  listItems = ['windDirection', 'facilities', 'groundConditions', 'vegetation', 'landType',
              'herbicides', 'infrastructure', 'landUse', 'weatherConditions', 'weeds'];
  lists = {};

  constructor(
    private router: Router,
    private menuController: MenuController,
    private cacheSaveDataService: CacheSaveDataService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private staticListsService: StaticlistService,
    private dfrRRRService: DfrRRRService,
    private genericPhotoService: GenericPhotoService,
    private formBuilder: FormBuilder,
    private genericFileService: FilesService,
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientsService
  ) {
    this.viewWidth = this.sharedService.getPlaformWidth();
    this.isMobileDevice = this.sharedService.isMobileDevice();
    console.log('daily constructor');
    this.initForm();
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    if (this.form === undefined || this.form === null) {
      this.initForm();
      //this.prepareForm();
    }
  }


  initForm() {
    this.dfrRRRService.getCurrentDFRForm().subscribe((val: any) => {
      this.form = val;
    }, (err) => '', () => '');

    if (this.staticListsService.rrrList.value === undefined || this.staticListsService.rrrList.value == null) {
      this.staticListsService.getListCollection2('rrr').subscribe(val => {
        this.getLists();
      });
    } else {
      this.getLists();
    }
  }


  getLists() {
    for (const i of this.listItems) {
        this.staticListsService.getListTypeForRRR(i).subscribe (val => {
          this.lists[i] = val;
          console.log (i);
          console.log (val);
        }, (err) => '', () => '');
    }
    console.log (this.listItems);
    console.log (this.staticListsService.rrrList.value);
  }

  setFormValues() {
    // tslint:disable-next-line: no-trailing-whitespace
    for (const i in this.form.controls) {
      if (i === 'dfrDate') {
        setTimeout(() => {
          this.sharedService.setFormDate(this.dfrRRRModel, this.form, i, this.dfrDate, true);
        }, 5);
      } else if (i === 'province' || i === 'timeOfInspection' || i === 'clientName') {
          setTimeout(() => {
          if (this.dfrRRRModel[i] !== undefined) {
            this.form.get(i).setValue(this.dfrRRRModel[i]);
          }
          }, 5);
      } else if (i === 'naNotes') {
        // Do Nothing
      } else {
        if (this.dfrRRRModel[i] !== undefined) {
          this.form.get(i).setValue(this.dfrRRRModel[i]);
        }
      }
    }
    console.log ('done form');
    if (this.dfrRRRModel._id === null || this.dfrRRRModel._id === undefined) {
      if (this.cacheSaveDataService.status.connected) {
        setTimeout(() => {
          this.onSaveForm();
        }, 2000);
      }
    }
  }

   onSaveForm() {

   }

   backToList() {
    this.router.navigate(['dfr-techlist']);
   }

  refreshPage(event: any, refresher: IonRefresher) {
    refresher.complete();
  }

  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }

  isSummitTechChanged(event) {

  }
  

}
