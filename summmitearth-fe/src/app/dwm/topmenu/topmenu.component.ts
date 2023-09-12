import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, AlertController, IonItemSliding, IonRefresher, IonList, NavController, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CameraPhoto } from '@capacitor/core';
import { SharedService } from '../../shared/shared.service';
import { StaticlistService } from '../../shared/staticlist.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../admin/users/auth.service';
import { ManageConfigService } from '../../admin/manageconfig.service';
import { GeneralModel } from './../general/general.model';
import { GeneralService } from './../general/general.service';

@Component({
  selector: 'app-topmenu',
  templateUrl: './topmenu.component.html',
  styleUrls: ['./topmenu.component.scss'],
})
export class TopmenuComponent implements OnInit {
 
  list: any[];
  //currentDFR: any;
  //currentDFRSub: Subscription;


  form: FormGroup;
  isPhone = false;
  viewWidth = 0;
  currentUser;
  currentGenInfo;

  constructor(private sharedService: SharedService,
    private authService: AuthService,
    private manageConfigService: ManageConfigService,
    private staticListService: StaticlistService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navController: NavController,
    private router: Router,
    private generalService: GeneralService) {
    this.viewWidth = this.sharedService.getPlaformWidth();
    this.currentUser = this.authService.getCurrentUser();
    this.isPhone = this.sharedService.isCellPhone();
   }


  ngOnInit() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {

    //this.currentUser = this.navParams.get('currentUser');
    this.generalService.getCurrentGen().subscribe((val: any) => {
      this.currentGenInfo = val;
      
    }, (err) => '', () => '');

  }


  moveTo(link) {
  // Get JobID
    let id = this.currentGenInfo._id;
    let jobId = this.currentGenInfo.jobNumber;
    if (link == 'generalInfo') {
      this.router.navigate( ['dwm', id, 'general']);
    } else if(link == 'landInfo') {
      this.router.navigate( ['dwm', id, 'land']);
    } else if(link == 'waterInfo') {
      this.router.navigate( ['dwm', id, 'water']);
    } else if(link == 'soilInfo') {
      this.router.navigate( ['dwm', id, 'soil']);
    }
  }
}
