import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController, LoadingController, IonItem, IonSearchbar, PopoverController, IonInput, MenuController } from '@ionic/angular';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from 'rxjs';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { MudpickerComponent } from 'src/app/shared/mudpicker/mudpicker.component';
import { DailyMudService } from '../../daily-summary/daily-mud-list/daily-mud.service';
import { DfrService } from '../../dfr.service';
import { DfrModel } from '../../dfr-model';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { ProjectTypeModel } from 'src/app/admin/project/projecttype.model';
import { ProjectLocationModel } from 'src/app/admin/project/projectlocation.model';
import * as moment from 'moment';
import { DailyMudModel } from '../../daily-summary/daily-mud/daily-mud.model';
import { DfroptionsComponent } from 'src/app/shared/dfroptions/dfroptions.component';

@Component({
  selector: 'app-mud-summary-list',
  templateUrl: './mud-summary-list.page.html',
  styleUrls: ['./mud-summary-list.page.scss'],
})
export class MudSummaryListPage implements OnInit {

  mudSummaryList: DailyMudModel[];
  newMudSummaryList: any[];
  dfrId: string;
  projectTypeModel: ProjectTypeModel;
  filterMudLocations: ProjectLocationModel[];

  currentDFR: DfrModel;
  viewWidth = 0;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private dailyMudService: DailyMudService,
    private sharedService: SharedService,
    private staticlistsService: StaticlistService,
    private dfrService: DfrService,
    private popoverController: PopoverController,
    private activatedRoute: ActivatedRoute,
    private manageconfigService: ManageConfigService,
    private router: Router) {
      this.viewWidth = this.sharedService.getPlaformWidth();
     }

  ngOnInit() {
    this.activatedRoute.params.subscribe(val => {
      this.dfrId = val.dfrid;

      this.dfrService.getCurrentDFR().subscribe(val2 => {
        this.currentDFR = val2;
        if (this.currentDFR === undefined || this.currentDFR === null) {
          this.dfrService.getDFRByDfrId(this.dfrId).subscribe(val3 => {
             this.currentDFR = val3;
             console.log ('DFR Changed');
             this.getProjectModel();
          });
        } else {
          this.getProjectModel();
        }
      });
    });

  }

  getProjectModel() {
    this.manageconfigService.getProjectByProjectNumberAndProjectType(this.currentDFR.projectNumber, this.currentDFR.projectType).subscribe(val2 => {
      this.projectTypeModel = val2;
      const refDate = moment(this.currentDFR.dfrDate).endOf('day').toDate();
      this.filterMudLocations = this.sharedService.filterList(refDate, this.projectTypeModel.locations);
      console.log (this.filterMudLocations);
      this.getMudList();
    });
  }

  async getMudList() {
    const loader = await this.loadingController.create({
      message: 'Calculating Mud Usage. One moment please.'
    }).then(loaderElement => {
        loaderElement.present();
        this.dailyMudService.getCalculatedMudByProjectCode(this.currentDFR._id).subscribe(val => {
          this.mudSummaryList = val;
          this.validateDisplayOrderOfMud();
          loaderElement.dismiss();
        });
   });
  }


  validateDisplayOrderOfMud() {
      this.mudSummaryList.forEach(val => {
        val.locations.forEach(val2 => {

        });
      });
  }

  backToRigList() {
    this.router.navigate(['tabs', 'dfr', this.currentDFR._id, 'dfrrigs']);
  }


  async showTopMenu(event) {
    console.log ('top menu');
    const popover = await this.popoverController.create({
      component: DfroptionsComponent,
      componentProps: {
        'dfrId': this.dfrId,
        'currentView': 'mudSummary'
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
    } else if (item === 'dailyMud') {
      this.onAddMud();
    } else if (item === 'viewRigs') {
      this.backToRigList();
    }  else if (item === 'createPDF') {
       // Do Nothing
    } 

    
  }

  onAddMud() {
    this.router.navigate(['tabs', 'dfr', this.currentDFR._id, 'mud']);
  }

  onDFRSummary() {
    this.router.navigate(['tabs', 'dfr', this.dfrId]);
  }

}
