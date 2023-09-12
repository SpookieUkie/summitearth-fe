import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRefresher, IonItemSliding, LoadingController, AlertController, MenuController, PopoverController } from '@ionic/angular';
import { DfrDailyRigModel } from './daily-rig/daily-rig.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DfrRigService } from './dfrrig.service';
import { Subscription, Observable, timer } from 'rxjs';
import { DfrService } from '../dfr.service';
import { take } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { DfroptionsComponent } from 'src/app/shared/dfroptions/dfroptions.component';
import { ActivitySummaryComponent } from '../activity-summary/activity-summary.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-daily-summary',
  templateUrl: './daily-summary.component.html',
  styleUrls: ['./daily-summary.component.scss'],
})
export class DailySummaryComponent implements OnInit {
  @ViewChild('activeSummary', { static: true }) activeSummary: ActivitySummaryComponent;

  dfrId: string;
  currentDFRRigSub: Subscription;
  currentDFRRig: DfrDailyRigModel;
  dfrRigList$: Observable<DfrDailyRigModel[]>;
  isPhone = false;
  viewWidth: 0;
  form: FormGroup;
  forceValidated = false;

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private dfrService: DfrService,
    private dfrRigService: DfrRigService,
    private sharedService: SharedService,
    private popoverController: PopoverController,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      this.viewWidth = this.sharedService.getPlaformWidth();
    }

  ngOnInit() {
    this.isPhone = this.sharedService.isCellPhone();
  }

  ionViewDidEnter() {
    console.log('ion view did enter');
    this.currentDFRRigSub = this.dfrRigService.getCurrentDFRRig().subscribe(val => {
      this.currentDFRRig = val;
    });
    this.activatedRoute.params.subscribe(val => {
      this.dfrId = val.id;
    });
    this.dfrRigList$ = this.dfrRigService.dfrRigListObs;
    this.getDFRRigList();
    this.form = this.activeSummary.form;
  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getDFRRigList();
    refresher.complete();
  }

  backToDFR() {
      console.log(this.dfrId);
      this.router.navigate(['tabs', 'dfr', this.dfrId]);
  }

  showHideFormErrors() {
    this.forceValidated = !this.forceValidated;
    this.sharedService.invalidateForm(this.form, this.forceValidated);
  }

  createNewRig() {
      this.dfrRigService.resetSelectedDFRRig();
      this.currentDFRRig.dfrId = this.dfrId;
      this.dfrRigService.saveDFRRig(this.currentDFRRig).subscribe(val => {
        this.currentDFRRig = val;
        this.getDFRRigList();
        this.router.navigate(['tabs', 'dfr', this.dfrId, 'dfrrigs', this.currentDFRRig._id]);
      });
  }

  async getDFRRigList() {
    const loader = await this.loadingController.create({
      message: 'Loading Rigs, One Moment.',
    }).then(loaderElement => {
      loaderElement.present();

      this.dfrRigService.getDFRRigList(this.dfrId);
      loaderElement.remove();

    })
  }

  editRig(item: DfrDailyRigModel, slidingItem: IonItemSliding) {
    // console.log ('Edit DFR' + item._id);
     slidingItem.close();
     this.itemClicked(item);
   }

   itemClicked(item) {
    this.dfrRigService.setCurrentDFRRig(item);
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'dfrrigs', item._id]);
   }

   async deleteRig(item: string, slidingItem: IonItemSliding) {
    console.log( 'Delete Item: ' + item);
    slidingItem.close();
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this Daily Rig',
      buttons: [
        {text: 'Yes',
        handler: (val) => {
          //TODO Delete Rig and related photos
          this.dfrRigService.deleteDFRRig(item).subscribe(val => {
              console.log ('Delete request complete');
              this.sharedService.showNotification('Daiy Rig Deleted');
              this.getDFRRigList();
          });
          /*this.dfrActivityService.deleteDFRActByDfrId(item).subscribe( val2 => {
            console.log ('Delete activity complete');
          });  */
        }},
        {text: 'No', handler: (val) => {
          console.log('Do Nothing');
        }} 
    ],
      header: 'Delete Record'
    }).then(alertElement => {
      alertElement.present();
    }); 
  }

  async showTopMenu(event) {
    console.log ('top menu');
    const popover = await this.popoverController.create({
      component: DfroptionsComponent,
      componentProps: {
        'dfrId': this.dfrId,
        'currentView': 'dailySummary'
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
    } else if (item === 'addRig') {
      this.createNewRig();
    } else if (item === 'viewRigs') {
      this.onViewRigs();
    } else if (item === 'mudSummary') {
      this.onSummaryMud();
    } else if (item === 'createPDF') {
       // Do Nothing
    } 
  }

  onSaveForm() {
    this.activeSummary.onSaveForm();
    this.activeSummary.form.markAsPristine();
  }

  onViewRigs() {
    this.router.navigate(['tabs', 'dfr', this.dfrId, 'dfrrigs']);
  }

  onDFRSummary() {
    this.router.navigate(['tabs', 'dfr', this.dfrId]);
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
