import { Component, OnInit } from '@angular/core';
import { CacheSaveDataService } from '../../auth/cache-save-data.service';
import { MenuController, PopoverController, LoadingController, IonRefresher } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormlistService } from '../formlist.service';
import { FormlistModel } from '../formlist.model';
import { SharedService } from '../../shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calculators',
  templateUrl: './calculators.page.html',
  styleUrls: ['./calculators.page.scss'],
})
export class CalculatorsPage implements OnInit {

  callists: FormlistModel[];
  sub: Subscription;
  viewWidth = 1000;

  constructor(
    private router: Router,
    private menuController: MenuController,
    private cacheDataService: CacheSaveDataService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private formlistService: FormlistService,
    private sharedService: SharedService,
    ) {
      this.viewWidth = this.sharedService.getPlaformWidth();
     }

  ngOnInit() {
    console.log ('ng on init');
    this.getList();
  }

  ionWillOpen() {
    console.log ('ion will open');
    this.getList();
  }

  getList() {
    this.sub = this.formlistService.getAllActiveFormsByType('calculator').subscribe(val => {
      this.callists = val;
      this.sub.unsubscribe();
    });
  }

  gotoLink(formLink) {
    this.router.navigate(['calculators', formLink]);
  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getList();
    refresher.complete();
  }

  backToList() {
    this.router.navigate(['welcome']);
  }

}
