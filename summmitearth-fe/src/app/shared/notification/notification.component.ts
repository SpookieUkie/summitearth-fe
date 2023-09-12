import { Component, OnInit } from '@angular/core';
import { Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken } from '@capacitor/core';
import { SharedService } from '../shared.service';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

const { PushNotifications } = Plugins;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  status = null;

  constructor(
    private sharedService: SharedService,
    private popoverController: PopoverController
    ) {
    
  }

  notifications: any = [];

  ngOnInit() {
   
    if (this.sharedService.isMobileDevice()) {
      this.status = true;
      PushNotifications.register();

      PushNotifications.addListener('registration', 
        (token: PushNotificationToken) => {
         // alert('Push registration success, token: ' + token.value);
          console.log('Push registration success');
          console.log (token.value);
          //TODO - Push token to server for messaging
        }
      );

      PushNotifications.addListener('registrationError', 
        (error: any) => {
          //alert('Error on registration: ' + JSON.stringify(error));
        }
      );

      PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
          //alert('Push received: ' + JSON.stringify(notification));
          console.log('Push Received')
          console.log(JSON.stringify(notification));
          notification.badge = 0;
        }
      );

      PushNotifications.addListener('pushNotificationActionPerformed', 
        (notification: PushNotificationActionPerformed) => {
          console.log('Push action')
         // alert('Push action performed: ' + JSON.stringify(notification));
          console.log(JSON.stringify(notification));
        }
      );
    }
    

  }

  async showPopover(event) {
    const message = 'Total Notifications: 0';
    const popover = await this.popoverController.create({
        component: PopoverComponent,
        componentProps: {
          'title': 'Notifications',
          'message': message,
        },
        event: event
      });
    return await popover.present();
  }
}
