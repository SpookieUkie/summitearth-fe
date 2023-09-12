import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';
import { AdminoptionslistComponent } from '../adminoptionslist/adminoptionslist.component';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StaticlistService } from '../staticlist.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-adminoptions',
  templateUrl: './adminoptions.component.html',
  styleUrls: ['./adminoptions.component.scss'],
})
export class AdminoptionsComponent implements OnInit {
  @Input() currentView: string;
  @Output() itemSelected =  new EventEmitter();

 
  sub: Subscription;
  sub2: Subscription;
  disposalMethods: any[];

  constructor(
    private popoverController: PopoverController,
    private manageConfigService: ManageConfigService,
    private staticListService: StaticlistService,
    private alertController: AlertController,
    private sharedService: SharedService,
    private router: Router) {
  }

  ngOnInit() {
    this.sub = this.staticListService.getDisposalMethodList('pipeline').subscribe((val: any) => {
      this.disposalMethods = val;
    });
  }

  ionViewDidEnter() {
    this.sub = this.staticListService.getDisposalMethodList('pipeline').subscribe((val: any) => {
      this.disposalMethods = val;
    });
  }

  ionViewDidLeave() {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
    if (this.sub2 !== undefined) {
      this.sub2.unsubscribe();
    }
  }


  async showTopMenu(event) {
    const popover = await this.popoverController.create({
      component: AdminoptionslistComponent,
      componentProps: {
        'id': 1,
        'currentView': this.currentView,
        'isLocked' : false,
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
    if (item === 'addempdfr' || item === 'addrrrdfr') {
      let projectType = '';
      let projectTypeLabel = '';
      if (item === 'addempdfr') {
        projectType = 'epmDFR';
        projectTypeLabel = 'DFR - EPM';

      } else {
        projectType = 'rrrDFR';
        projectTypeLabel = 'DFR - RRR';
      }
       this.createNewDFR(projectType, projectTypeLabel);
    } else if (item === 'addlocation') {
       this.itemSelected.emit(item);
    } else if (item === 'createFieldTicket') {
       this.itemSelected.emit(item);
    } else if (item === 'createExcelDFR') {
        this.itemSelected.emit(item);
    } else if (item === 'customFieldTicket') {
      this.itemSelected.emit(item);
    } else if (item === 'dailyauditdwm') {
      this.itemSelected.emit(item);
    } else if (item === 'muds') {
      this.itemSelected.emit(item);
    }
  }

  async createNewDFR(projectType, projectTypeLabel) {
    const alert = await this.alertController.create({
      subHeader: 'New Project: ' + projectType,
      message: 'Enter the Project Number for the Project',
      inputs: [
        {
          name: 'projectNumber',
          type: 'number',
          min: 1,
          id: 'projectNumber',
          placeholder: 'Project Number'
        }
      ],
      buttons:  [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          // Do Nothing
          }
        }, {
          text: 'Ok',
          handler: (val) => {
            console.log('Confirm Ok');
            console.log(val);
            if (val.projectNumber !== null && val.projectNumber !== undefined && val.projectNumber !== '' && Number(val.projectNumber) > 0) {
              this.validateProjectNumber(val.projectNumber, projectType, projectTypeLabel);
            } else {
              this.sharedService.showNotification('A Project Number is Required to Setup a New DFR Project', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  validateProjectNumber(projectNumber, projectType, projectTypeLabel) {
    this.manageConfigService.getProjectByProjectNumberAndProjectType(projectNumber, projectType).subscribe((val: any) => {
      if (val) {
        this.saveNewProject(projectNumber, projectType, projectTypeLabel);
      } else {
        this.sharedService.showNotification('The Project Number already exists in the system', 'danger');
      }
    }, (err: any) => {
      this.sharedService.showNotification('The Project Number already exists in the system', 'danger');
    }, () => '') ;
  }

  saveNewProject(projectNumber, projectType, projectTypeLabel) {
    this.manageConfigService.saveNewProject(this.disposalMethods, projectType, projectNumber, projectTypeLabel).subscribe((val2: any) => {
      const v = val2.data;
      this.manageConfigService.currentProjectType.next(v);
      this.router.navigate(['admin', 'project', v._id]);
    }, (err) => this.sharedService.showNotification('Error creating new project', 'danger'),
    () => '');
}


}
