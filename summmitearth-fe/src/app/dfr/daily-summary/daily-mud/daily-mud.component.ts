import { Component, OnInit, Input, Output, ViewChild, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DailyMudModel } from './daily-mud.model';
import { AlertController, LoadingController, IonItem, IonSearchbar, PopoverController, IonInput } from '@ionic/angular';
import { DailyMudService } from '../daily-mud-list/daily-mud.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from 'rxjs';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { MudpickerComponent } from 'src/app/shared/mudpicker/mudpicker.component';
import { ManageConfigService } from 'src/app/admin/manageconfig.service';
import { DailyMudLocationModel } from './daily-mud-location.model';

@Component({
  selector: 'app-daily-mud',
  templateUrl: './daily-mud.component.html',
  styleUrls: ['./daily-mud.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class DailyMudComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() index: number;
  @Output() valChanged = new EventEmitter();
  @ViewChild('productName', { static: true }) productName: IonInput;
  @ViewChild('size', { static: true }) size: IonInput;
  @ViewChild('toxicity', { static: true }) toxicity: IonInput;

  mudList: any[];
  filteredMudList: any[];
  showResults = false;
  dailyMudLocations: DailyMudLocationModel[];
  filteredDailyMudLocations: DailyMudLocationModel[];

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private dailyMudService: DailyMudService,
    private sharedService: SharedService,
    private staticlistsService: StaticlistService,
    private manageconfigService: ManageConfigService,
    private popoverController: PopoverController) {
     }

  ngOnInit() {

  }

  showValue() {
    console.log(this.form.value);
  }

  async showMudPickerCheck(event) {
    if (!this.sharedService.isMobileDevice()) {
      this.showMudPicker(event);
    }
  }

  async showMudPicker(event) {
    const popover = await this.popoverController.create({
        component: MudpickerComponent,
       // event: event,
        cssClass: 'mudPopover',
        translucent: true,
        componentProps: {
          mudProduct: this.form.value.productName,
        }
      });
    popover.onDidDismiss().then(val => {
      console.log (val);
        if (val.data !== undefined) {
          this.form.value.productName  = val.data.mudProductName;
          this.productName.value = val.data.mudProductName;
          this.form.value.size  = val.data.defaultUnitSize + ' ' + val.data.defaultUnitType;
          this.size.value = val.data.defaultUnitSize + ' ' + val.data.defaultUnitType;
          this.form.value.toxicity  = val.data.mtoxThreshold;
          this.toxicity.value = val.data.mtoxThreshold;
          this.valChanged.emit(null);
        }
    });
    return await popover.present();
  }


  async removeMud() {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this mud product?',
      buttons: [
        {text: 'Yes',
        handler: (val) => {
            this.dailyMudService.deleteMud(this.form.value._id).subscribe(val2 => {
                console.log ('Delete request complete');
                this.sharedService.showNotification('Mud Deleted');
                this.dailyMudService.removeMudForm(this.index);
            });
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

  updateMud(data) {
    this.form.value.locations.forEach(el => {
       if (el._id === data._id) {
         el.total = data.total;
         this.valChanged.emit(null);
       }
    });
  }


}
