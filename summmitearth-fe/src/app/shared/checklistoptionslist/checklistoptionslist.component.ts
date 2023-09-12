import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, NavParams, AlertController } from '@ionic/angular';
import { SharedService } from '../shared.service';
import { DfrService } from 'src/app/dfr/dfr.service';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { DfrActivityService } from 'src/app/dfr/activity-summary/dfr-activity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checklistoptionslist',
  templateUrl: './checklistoptionslist.component.html',
  styleUrls: ['./checklistoptionslist.component.scss'],
})
export class ChecklistoptionslistComponent implements OnInit {
  @Output() itemSelected =  new EventEmitter();

  popover
  
  currentView;
 
  emitter:EventEmitter<string>;

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
      this.emitter = navParams.data.theEmitter;
  }

  ngOnInit() {}


  menuItem(val) {
    this.emitter.emit(val);
  }
}
