import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, NavParams, AlertController } from '@ionic/angular';
import { SharedService } from '../shared.service';
import { DfrService } from 'src/app/dfr/dfr.service';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { DfrActivityService } from 'src/app/dfr/activity-summary/dfr-activity.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-adminoptionslist',
  templateUrl: './adminoptionslist.component.html',
  styleUrls: ['./adminoptionslist.component.scss'],
})
export class AdminoptionslistComponent implements OnInit {
  
  currentDFR;
  currentDFRActivity;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  currentView: string;

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private navParams: NavParams,
    private alertController: AlertController,
    private sharedService: SharedService,
    private dfrService: DfrService,
    private dfrActivityService: DfrActivityService,
    private manageConfigService: ManageConfigService,
    ) { 
    this.currentView = navParams.data.currentView;
  }

  ngOnInit() {}


  menuItem(item) {
    this.popoverController.dismiss(item);
    if (item === 'projects') {
      this.router.navigate(['admin', 'project']);
    } else if (item === 'users') {
      this.router.navigate(['admin', 'users']);
    } else if (item === 'admin') {
      this.router.navigate(['admin']);
    } else if (item === 'tech') {
      this.router.navigate(['welcome']);
    } else if (item === 'adduser') {
      this.router.navigate(['admin', 'users', 'add']);
    } else if (item === 'dfrs') {
      this.router.navigate(['admin', 'dfrs']);
    } else if (item === 'addlocation') {
      
    } else if (item === 'newrrrdfrreport') {
      this.createNewDFR('rrrDFR');
    } else if (item === 'newempdfrreport') {
      this.createNewDFR('epmDFR');
    } else if (item === 'createFieldTicket') {

    } else if (item === 'clients') {
      this.router.navigate(['admin', 'clients']);
    }  else if (item === 'addclient') {
      this.router.navigate(['admin', 'clients', 'add']);
    } else if (item === 'fieldticketoptions') {
      this.router.navigate(['admin', 'fieldticketoptions']);
    } else if (item === 'addfieldticketoptions') {
      this.router.navigate(['admin', 'fieldticketoptions', 'add']);
    } else if (item === 'dailyauditdwm') {
        this.router.navigate(['admin', 'dailyauditdwm']);
    } else if (item === 'muds') {
        this.router.navigate(['admin', 'muds']);
    } else if (item === 'customFieldTicket') {
      
    }
  }

    // Save 2 document first, then load the route
    async createNewDFR(projectType) {
      const alert = await this.alertController.create({
        subHeader: 'New Daily Field Report',
        message: 'Enter the Project Number for the Daily Field Report',
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
                this.validateProjectNumber(val.projectNumber, projectType);
              } else {
                this.sharedService.showNotification('A Project Number is Required to Setup a New Daily Field Report', 'danger');
              }
            }
          }
        ]
      });

      await alert.present();
  }

  validateProjectNumber(projectNumber, projectType) {
    this.manageConfigService.getProjectByProjectNumberAndProjectType(projectNumber, projectType).subscribe((val: any) => {
      if (val.data !== null) {
        this.saveNewDFR(projectNumber);
      } else {
        this.sharedService.showNotification('The Project Number does not exist in the current system', 'danger');
      }
    }, (err: any) => {
      this.sharedService.showNotification('The Project Number does not exist in the current system', 'danger');
    }) ;
  }

  saveNewDFR(projectNumber) {
    this.sub3 = this.dfrService.getCurrentDFR().subscribe(val1 => {
      this.currentDFR = val1;
    });
    this.sub4 = this.dfrActivityService.getCurrentActivityDFR().subscribe(val2 => {
      this.currentDFRActivity = val2;
    });
    this.dfrService.resetSelectedDFR(projectNumber);
    this.dfrActivityService.resetSelectedDFR();
    console.log ('save new dfr from admin');
    this.sub1 =  this.dfrService.saveDFR(this.currentDFR).subscribe(val => {
        this.dfrService.setCurrentDFR(val);
        this.currentDFRActivity.dfrId = val._id;
        this.sub2 = this.dfrActivityService.saveDFRAct(this.currentDFRActivity, null).subscribe(val2 => {
          this.dfrActivityService.setCurrentActivityDFR(val2);
          this.sub2.unsubscribe();
          this.sub1.unsubscribe();
          this.sub3.unsubscribe();
          this.sub4.unsubscribe();
          this.router.navigate(['tabs', 'dfr', val._id]);
        });
    });
  }
}
