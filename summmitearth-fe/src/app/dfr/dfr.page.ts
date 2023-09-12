import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSlides, IonSlide } from '@ionic/angular';
import { DfrService } from './dfr.service';
import { Subscription } from 'rxjs';
import { DfrModel } from './dfr-model';
import { DfrActivityService } from './activity-summary/dfr-activity.service';
import { DfrActivityModel } from './activity-summary/dfr-activity-model';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dfr',
  templateUrl: 'dfr.page.html',
  styleUrls: ['dfr.page.scss']
})
export class DFRPage implements OnInit {
  
  @ViewChild('slides') slides: IonSlides;
  @ViewChild('slide1') slide1: IonSlide;
  @ViewChild('slide2') slide2: IonSlide;


  currentDFR: DfrModel;
  currentDFRSubscription: Subscription;
  currentDFRActivity: DfrActivityModel;
  currentDFRActivitySubscription: Subscription;
  isLocked = false;

  constructor(
    private dfrService: DfrService,
    private dfrActivityService: DfrActivityService,
    private sharedService: SharedService,
    private router: Router) {
  }

  ngOnInit() {
    this.currentDFRSubscription = this.dfrService.getCurrentDFR().subscribe(dfr => {
      this.currentDFR = dfr;
    });

    this.currentDFRActivitySubscription = this.dfrActivityService.getCurrentActivityDFR().subscribe(dfrAct => {
      this.currentDFRActivity = dfrAct;
    });
  }

  ngAfterViewInit() {
   
  }

  backToDFRList() {
    this.router.navigate(['tabs']);
  }




}
