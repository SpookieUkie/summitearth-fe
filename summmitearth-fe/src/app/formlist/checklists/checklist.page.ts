import { Component, OnInit } from '@angular/core';
import { CacheSaveDataService } from '../../auth/cache-save-data.service';
import { MenuController, PopoverController, LoadingController, IonRefresher } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormlistService } from '../formlist.service';
import { FormlistModel } from '../formlist.model';
import { SharedService } from '../../shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {


  checklists: FormlistModel[];
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
      this.sub = this.formlistService.getAllActiveFormsByType('audit').subscribe(val => {
        this.checklists = val;
        console.log ('Got Checklists');

      });
    }

  ionViewWillLeave() {
    console.log ('Leaving');
    this.sub.unsubscribe();
  }

  gotoLink(formLink) {
    this.router.navigate(['checklist', formLink]);
  }

  backToList() {
    this.router.navigate(['welcome']);
  }

  refreshPage(event: any, refresher: IonRefresher) {
    refresher.complete();
  }



}
