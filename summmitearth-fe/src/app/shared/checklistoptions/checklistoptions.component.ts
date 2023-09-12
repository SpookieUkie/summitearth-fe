import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { StaticlistService } from '../staticlist.service';
import { Router } from '@angular/router';
import { ChecklistoptionslistComponent } from '../checklistoptionslist/checklistoptionslist.component';

@Component({
  selector: 'app-checklistoptions',
  templateUrl: './checklistoptions.component.html',
  styleUrls: ['./checklistoptions.component.scss'],
})
export class ChecklistoptionsComponent implements OnInit {
  @Input() currentView: string;
  @Output() itemSelected =  new EventEmitter();

  myEmitter = new EventEmitter< any >();
  refPopover = null;
  constructor(
    private popoverController: PopoverController,
    private manageConfigService: ManageConfigService,
    private staticListService: StaticlistService,
    private router: Router) {
  }

  ngOnInit() {
    this.myEmitter.subscribe(val => {
      this.onMenuItem(val);
    })
  }

  async showTopMenu(event) {

    const popover = await this.popoverController.create({
      component: ChecklistoptionslistComponent,
      componentProps: {
        'id': 1,
        'currentView': this.currentView,
        'isLocked' : false,
        theEmitter: this.myEmitter
      },
      event: event,
      translucent: true,
      mode: 'ios',
      cssClass: 'dfrMenuPopover',

    });
  
    popover.onDidDismiss()
      .then((result: any) => {
        // Do nothing
      });
    this.refPopover = popover;
    return await popover.present();
  }

  onMenuItem(item) {
    console.log ('ON MENU ITEM ' + item);
    if (this.refPopover !== null) {
      this.refPopover.dismiss();
    }
    if (item === 'addsprayfield') {
      this.itemSelected.emit(item);
    } else if (item === 'addphoto') {
      this.itemSelected.emit(item);
    } else if (item === 'addfile') {
      this.itemSelected.emit(item);
    } else if (item === 'auditexcel') {
      this.itemSelected.emit(item);
    } else if (item === 'downloadattachments') {
      this.itemSelected.emit(item);
    } else if (item === 'submitchecklist') {
       this.itemSelected.emit(item);
    }
  }
}
