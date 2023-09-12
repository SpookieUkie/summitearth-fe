import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { SharedService } from '../shared.service';
import { Platform, PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';

const { Network } = Plugins;

@Component({
  selector: 'app-networkstatus',
  templateUrl: './networkstatus.component.html',
  styleUrls: ['./networkstatus.component.scss'],
})
export class NetworkstatusComponent implements OnInit {

  status = null;
  constructor(
    private sharedService: SharedService,
    private popoverController: PopoverController,
    private cacheSavedDataService: CacheSaveDataService,
    ) {
  }

  ngOnInit() {
      console.log ('init');
      this.getStatus();
  }

  async getStatus() {
       this.status = await Network.getStatus();
  }

  async showPopover(event) {
    let message = 'Offline';
    console.log (this.status);
    if (this.status.connected) {
      message = 'Connected using ' + this.status.connectionType;
    }

    const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          'title': 'Network Status',
          'message': message,
        },
        event: event
      });
    return await popover.present();
    
  }

}
