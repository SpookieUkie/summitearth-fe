import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DfrService } from '../dfr.service';
import { IonInput, PopoverController, LoadingController, NavController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/shared/popover/popover.component';
import { DfrActivityService } from './dfr-activity.service';
import { Subscription, Observable } from 'rxjs';
import { DfrActivityModel } from './dfr-activity-model';
import { ActivatedRoute, Router } from '@angular/router';

import { StaticlistService } from 'src/app/shared/staticlist.service';
import { pluck } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { DfrModel } from '../dfr-model';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { ProjectTypeModel } from 'src/app/admin/project/projecttype.model';
import * as moment from 'moment';
import { ProjectLocationModel } from 'src/app/admin/project/projectlocation.model';
import { DfrDailyRigModel } from '../daily-summary/daily-rig/daily-rig.model';
import { DfrRigService } from '../daily-summary/dfrrig.service';
import { Network, NetworkStatus } from '@capacitor/core';
import { async } from 'q';

@Component({
  selector: 'app-activity-summary',
  templateUrl: './activity-summary.component.html',
  styleUrls: ['./activity-summary.component.scss'],
})
export class ActivitySummaryComponent implements OnInit, OnDestroy {

  form: FormGroup;
  

  currentDFRActivity: DfrActivityModel;
  currentDFRActivitySubscription: Subscription;
  router: Router;
  projectTypeModel: ProjectTypeModel;


  sprayFieldConditions: any[];
  disposalList: any[]; // list of all active disposals
  fullDisposalList: any[];
  id: string;
  dfrId: string;
  status: NetworkStatus;

  currentDFR: DfrModel;
  currentDFRSub: Subscription;

  filterDisposalLocations: ProjectLocationModel[];
  dfrRigList$: Observable<DfrDailyRigModel[]>;

  projectDisposalSummaryList$: Observable<any[]>;
  projectDisposalSummaryList: any[];

  crossingLocationSummaryList$: Observable<any[]>;
  crossingLocationSummaryList: any[];

  subscriptions: any[];

  constructor(
    private dfrService: DfrService,
    private dfrActivityService: DfrActivityService,
    private dfrRigService: DfrRigService,
    private staticlistService: StaticlistService,
    private sharedService: SharedService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private manageConfigService: ManageConfigService,
    private activatedRoute: ActivatedRoute,
    privaterouter: Router
    ) {
  }

  ngOnInit() {
    
    console.log ('NG ON INIT')
    this.form = new FormGroup({
      dfrId: new FormControl(null, {
        updateOn: 'blur',
      }),
      numberOfActiveDrillsAndRigs: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      sprayFieldConditions: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      remainingVolumeInStorage: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      projectToDateTotal: new FormControl(null, {
        updateOn: 'blur',
      }),
    });

    console.log (' ON INIT Activity Summary');
    this.activatedRoute.params.subscribe(val => {
      this.dfrId = val.id;
      this.currentDFRActivitySubscription = this.dfrActivityService.getDFRActByDfrId(this.dfrId).subscribe(dfrAct => {
        this.currentDFRActivity = dfrAct;
        this.id = this.currentDFRActivity._id;
        // Only update 2 static values.
        this.form.get('sprayFieldConditions').setValue(this.currentDFRActivity.sprayFieldConditions);
        this.form.get('remainingVolumeInStorage').setValue(this.currentDFRActivity.remainingVolumeInStorage);

        this.dfrRigList$ = this.dfrRigService.dfrRigListObs;

        this.projectDisposalSummaryList$ = this.dfrActivityService.dfrProjectDisposalSummaryListObs;
        this.crossingLocationSummaryList$ = this.dfrActivityService.dfrCrossingSummaryListObs;
       
        
         // Observables for summarized calculations and total rigs
        this.dfrRigList$.subscribe(val3 => {
          this.form.get('numberOfActiveDrillsAndRigs').setValue(val3.length);
        });

        this.projectDisposalSummaryList$.subscribe(val2 => {
            this.getTotalRigSummaryForAll();
            this.projectDisposalSummaryList = val2;
            this.currentDFRActivity.dailyDisposalSummary = val2;
        });

        this.crossingLocationSummaryList$.subscribe( val3 => {
            this.crossingLocationSummaryList = val3;
            this.currentDFRActivity.crossingSummary = this.crossingLocationSummaryList;
        });

      });

        this.dfrService.getCurrentDFR().subscribe(val2 => {
          this.currentDFR = val2;
          if (this.currentDFR === undefined || this.currentDFR === null) {
            this.dfrService.getDFRByDfrId(this.dfrId).subscribe(val3 => {
               this.currentDFR = val3;
               this.getProjectModel();
            });
          } else {
            this.getProjectModel();
          }
        });


        this.form.markAsDirty();

    });

    this.staticlistService.getSprayFieldConditionList('pipeline')
      .subscribe(data => {
        this.sprayFieldConditions = data;
      });

    this.staticlistService.getDisposalMethodList('pipeline')
      .subscribe(data2 => {
        this.fullDisposalList = data2;
        this.updateFormList();
      });

  }

  ngOnDestroy() {

  }


  getTotalRigSummaryForAll() {
    return this.dfrActivityService.getTotalRigSummaryForAll();
  }

  updateFormList() {
    if (this.disposalList !== null && this.disposalList !== undefined) {
      this.disposalList.forEach(val => {
        this.form.addControl(val.locationName, new FormControl(null, {
          updateOn: 'blur',
        }));
      });
    }
  }

  getProjectModel() {
    if (this.currentDFR.projectNumber !== undefined) {

      this.manageConfigService.getProjectByProjectNumberAndProjectType(this.currentDFR.projectNumber, this.currentDFR.projectType).subscribe(val2 => {
        this.projectTypeModel = val2;
        const refDate = moment(this.currentDFR.dfrDate).endOf('day').toDate();
        this.filterDisposalLocations = this.sharedService.filterList(refDate, this.projectTypeModel.locations);
        this.disposalList = this.projectTypeModel.disposalMethods.filter((val) => {
            return val.isActive === true;
        });
        this.getSummaries();
      });
    }
  }

  getSummaries() {
    const date = this.currentDFR.dfrDate.toString().substring(0, 10);
    this.dfrActivityService.getDFRDisposalSummary(this.currentDFR.projectNumber, date);
    this.dfrActivityService.getDFRCrossingSummary(this.currentDFR.projectNumber, date);
    this.canFormSave();
  }

  async canFormSave() {
    await this.getStatus();
    if (this.status.connected) {
      this.onSaveForm();
    }
  }

  async presentPopover(event) {
    const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          'title': 'Spray Field Conditions - Tip',
          'message': 'If wet, a comment in the activity summary is required, ie. not rutting, too wet and shut down'
        },
        event: event
      });
    return await popover.present();
  }

  async onSaveForm() {
    let el;
    try {

      this.form.value.dfrId = this.currentDFRActivity.dfrId;
      this.form.value.dailyDisposalSummary = this.createDailyDisposal();
      this.form.value.projectDisposalSummary = this.projectDisposalSummaryList;
      this.form.value.crossingSummary = this.crossingLocationSummaryList;
      this.form.value.projectToDateTotal =  this.getTotalRigSummaryForAll();

      const loader = await this.loadingController.create({
        message: 'Saving DFR, one moment please.',
        animated: true
      }).then(loaderElement => {
        el = loaderElement;
        el.present();
        
        this.dfrActivityService.saveDFRAct(this.form.value, this.id).subscribe( val => {
          el.remove();
          this.sharedService.showNotification('Daily Field Report - Summary Saved');
        }, error => {
          el.remove();
          //this.sharedService.showAlert('Error Saving DFR Activity. Please ensure all fields are valid');
        });
      });
    } catch (error) {
      console.log ("ERROR SAVING ACTIVITY")
      console.log (error);
      if (el !== undefined) {
        el.remove();
      }
    }
  }

  sumValChanged() {
    this.form.markAsDirty();
  }

  createDailyDisposal() {
    const dailyDisSummary = Array();
    this.fullDisposalList.forEach(el => {
        const val = this.dfrRigService.getDailyRigSummaryForType(el.value);
        dailyDisSummary.push({_id: el._id , disposalMethod: el.value, summaryTotal: val });
    });
    return dailyDisSummary;
  }

  checkNetworkStatus() {
    if (this.sharedService.isMobileDevice()) {
      let handler = Network.addListener('networkStatusChange', (status) => {
        console.log('Network status changed', status);
        this.status = status;
      });

      this.getStatus();
    }
  }

  async getStatus() {
       this.status = await Network.getStatus();
  }

  onViewRigs() {
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'dfrrigs']);
  }

  onAddMud() {
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'mud']);
  }

  onSummaryMud() {
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'mudsummary']);
  }

  backToDFRList() {
    this.router.navigate(['tabs']);
  }

}
