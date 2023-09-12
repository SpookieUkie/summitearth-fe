import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DfrService } from '../../dfr.service';
import { SharedService } from 'src/app/shared/shared.service';
import { DFRPhotoService } from '../dfr-photo/dfr-photo.service';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { PopoverController, LoadingController, AlertController, IonRefresher, IonRow, NavController, MenuController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray } from '@angular/forms';
import { DailyMudModel } from '../daily-mud/daily-mud.model';
import { DailyMudService } from './daily-mud.service';
import { Subscription } from 'rxjs';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { DailyMudLocationModel } from '../daily-mud/daily-mud-location.model';
import { DfrModel } from '../../dfr-model';
import { ProjectTypeModel } from 'src/app/admin/project/projecttype.model';
import { ProjectLocationModel } from 'src/app/admin/project/projectlocation.model';
import * as moment from 'moment';
import { DfroptionsComponent } from 'src/app/shared/dfroptions/dfroptions.component';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';

@Component({
  selector: 'app-daily-mud-list',
  templateUrl: './daily-mud-list.component.html',
  styleUrls: ['./daily-mud-list.component.scss'],
})
export class DailyMudListComponent implements OnInit, OnDestroy {
  @ViewChild('mudProductsView', { static: true }) mudProductsView: IonRow;


  dfrId: string;
  mudForm: FormGroup;
  mudFormSub: Subscription;
  mudListArray: FormArray;
  dailyMudList: DailyMudModel[];
  projectTypeModel: ProjectTypeModel;
  filterMudLocations: ProjectLocationModel[];

  currentDFRSub: Subscription;
  currentDFR: DfrModel;
  viewWidth = 0;

  constructor(
    private dfrService: DfrService,
    private sharedService: SharedService,
    private dfrPhotoService: DFRPhotoService,
    private staticlistService: StaticlistService,
    private dailyMudService: DailyMudService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private manageconfigService: ManageConfigService,
    private cacheSaveDataService: CacheSaveDataService,
    private router: Router,
    private navController: NavController,

    ) {
      this.viewWidth = this.sharedService.getPlaformWidth();
    }

  ngOnInit() {
    console.log ('Init Daily Mud List');
  }

  ngOnDestroy() {
    console.log ('on destroy');
   
  }

  ionViewWillLeave() {
    console.log ('Ion View Will Leave');
    //this.currentDFRSub.unsubscribe();
    this.mudFormSub.unsubscribe();
    this.dailyMudService.clearFormSubject();
    this.dailyMudService.setMudList(undefined);
    
  }

  ionViewWillEnter() {
    console.log ('Ion View Enter');
    this.activatedRoute.params.subscribe(val => {
      this.dfrId = val.dfrid;
    });
    this.mudFormSub = this.dailyMudService.mudFormsObs.subscribe(val => {
      this.mudForm = val;

     if (this.mudForm !== undefined) {
        console.log ('--- Mud List Array ----');
        console.log (this.mudForm.get('mudList') );
        this.mudListArray = this.mudForm.get('mudList') as FormArray;
     }

    });
    this.currentDFRSub = this.dfrService.getCurrentDFR().subscribe(val => {
      this.currentDFR = val;
      if (this.currentDFR === undefined || this.currentDFR === null) {
        this.dfrService.getDFRByDfrId(this.dfrId).subscribe(val2 => {
           this.currentDFR = val2;
           this.getProjectModel();
        });
      } else {
           this.getProjectModel();
      }
    });
    this.getMudList();
  }

  getProjectModel() {
    this.manageconfigService.getProjectByProjectNumberAndProjectType(this.currentDFR.projectNumber, this.currentDFR.projectType).subscribe(val2 => {
      this.projectTypeModel = val2;
      const refDate = moment(this.currentDFR.dfrDate).endOf('day').toDate();
      this.filterMudLocations = this.sharedService.filterList(refDate, this.projectTypeModel.locations);
    });
  }

  refreshPage(event: any, refresher: IonRefresher) {

    for (let i = this.mudListArray.controls.length - 1; i > -1; --i) {
      this.dailyMudService.removeMudForm(i);
    }

    this.getMudList();
    refresher.complete();
  }

  async getMudList() {
    let loaderElement;
    const loader = await this.loadingController.create({
      message: 'Loading Mud Records. One moment please.'
    }).then(le => {
        loaderElement = le;
        loaderElement.present();
        this.dailyMudService.popuplateMudForms(this.dfrId, loaderElement);
      }, err => {
        loaderElement.remove();
      });
  }

  addMudProduct() {
    console.log('Add Mud');
    let mudLocationList = new Array<DailyMudLocationModel>();
    this.filterMudLocations.forEach(mudLoc => {
      const mudLocation = new DailyMudLocationModel(mudLoc._id, mudLoc.locationName, null, mudLoc.displayOrder  );
      mudLocationList.push(mudLocation);
    });
    const localId = this.sharedService.generateId();
    this.dailyMudService.addMudForm2(this.dfrId, localId, mudLocationList);
  }

  async saveMud() {
    const loader = await this.loadingController.create({
      message: 'Saving Mud Records. One moment please.'
    }).then(loaderElement => {
      loaderElement.present();
      this.dailyMudService.saveDailyMudList(this.dfrId, this.mudForm.value).subscribe(val => {
        loaderElement.remove();
        this.sharedService.showNotification ('Mud Records Saved');
        this.mudListArray.markAsPristine();
      }, err => {
        loaderElement.remove();
        console.log (err);
        console.log (err.status);
        if (this.cacheSaveDataService.status.connected) {
          this.sharedService.showNotification ('Error Saving Mud', 'error');
        }
      });
    });
  }

  backToRigList() {
    this.navController.pop();
    this.router.navigate(['tabs', 'dfr', this.dfrId]);
  }

  async showTopMenu(event) {
    console.log ('top menu');
    const popover = await this.popoverController.create({
      component: DfroptionsComponent,
      componentProps: {
        'dfrId': this.dfrId,
        'currentView': 'dailyMud'
      },
      event: event,
      translucent: true,
      mode: 'ios',
      cssClass: 'dfrMenuPopover'
    });

    popover.onDidDismiss()
    .then((result: any) => {
      console.log(result.data);
     this.onMenuItem(result.data);
    });
    return await popover.present();
  }


  onMenuItem(item) {
    console.log('item val');
    console.log (item);
    if (item === 'dfrSummary') {
      this.onDFRSummary();
    } else if (item === 'viewRigs') {
      this.onViewRigs();
    } else if (item === 'addMud') {
      this.onAddMud();
    }  else if (item === 'mudSummary') {
      this.onSummaryMud();
    }  else if (item === 'createPDF') {
       // Do Nothing
    } 
  }

  mudValChanged() {
    this.mudListArray.markAsDirty();
  }

  onAddMud() {
    this.addMudProduct();
  }

  onSummaryMud() {
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'mudsummary']);
  }

  onViewRigs() {
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'dfrrigs']);
  }

  onSaveForm() {
    this.saveMud();
  }

  onDFRSummary() {
    this.router.navigate(['tabs', 'dfr', this.dfrId]);
  }

}
