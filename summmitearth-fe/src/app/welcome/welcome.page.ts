import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { IonRefresher, LoadingController } from '@ionic/angular';
import { environment } from './../../environments/environment';
import { SharedService } from '../shared/shared.service';
import { AuthService } from '../admin/users/auth.service';
import { StaticlistService } from '../shared/staticlist.service';
import { UserModel } from '../admin/users/user.model';
import { filter } from 'rxjs/operators';
const { Browser } = Plugins;
const { Geolocation } = Plugins;
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  viewWidth = 1000;
  currentUser: UserModel;
  isCell = false;
  isProduction = false;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private staticListService: StaticlistService,
    private authService: AuthService) {
    this.viewWidth = this.sharedService.getPlaformWidth();
    this.currentUser = this.authService.getCurrentUser();
    this.isCell = this.sharedService.isCellPhone();
    this.isProduction = environment.production;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getData();
  }

  getData() {
    this.staticListService.getProvinceList('dwm');
    this.staticListService.getCementStorageTypeList('dwm');
    this.staticListService.getWellTypeList('dwm');
    this.staticListService.getListCollection('rrr');
    this.staticListService.getListCollection('any');
  }

  navChecklist() {
    this.router.navigate(['checklist']);
  }

  navAudit() {
    this.router.navigate(['tabs']);
  }

  navCalc() {
    this.router.navigate(['calculators']);
  }

  navDWM() {
    this.router.navigate(['dwm']);
  }

  navRRR() {
    this.router.navigate(['dfr-techlist']);
  
  /*  this.staticListService.getListTypeForRRR('groundCondition').subscribe ((val: any) => {
      const list2 = val;
      console.log (list2);
    }); */

  }

  async navMap() {
    console.log ('getlocation');
    const loader = await this.loadingController.create({
      message: 'Trying to load current coordinates. One Moment.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.getCoordinates(loaderElement);
    });
  }

  async getCoordinates(loaderElement) {
    try {
      //Send Request for Tracking. Should be done before the coordinates are completed
      const user = this.authService.getCurrentUser();
      const key = this.sharedService.generateId();
      let appType = 'Tech';
      if (user.permissions.dwmMapsAdmin)  {
        appType = 'Admin';
      }

      // This should complete before the coordinates are returned
      this.sharedService.trackUser(user._id, appType, key).subscribe((val: any) => {
        console.log (val);
      }, (err) => {
        console.log (err);
      });

      const coordinates = await Geolocation.getCurrentPosition();
      const lng = coordinates.coords.longitude.toFixed(6);
      const lat =  coordinates.coords.latitude.toFixed(6);
      const link = environment.mapURL + user._id + '&key_id=' + key + '&defaultLat=' + lat + '&defaultLng=' + lng + '&rand=' + Math.random();
      await Browser.open({ url: link });
      loaderElement.dismiss();
      this.sharedService.showNotification('Loading Mapping Application'); 
    } catch (err) {
      console.log ('Error' + err);
      const lat = '53.34300';
      const lng =  '-114.333';
      this.sharedService.showNotification('Failed Getting Current Coordinates', 'danger');
      const link = environment.mapURL + 'user_id=284&defaultLat=' + lat + '&defaultLng=' + lng + '&rand=' + Math.random();
      await Browser.open({ url: link }); 
      loaderElement.dismiss();
    }
  }

  refreshPage(event: any, refresher: IonRefresher) {
    refresher.complete();
  }

}
