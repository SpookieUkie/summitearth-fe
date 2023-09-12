import { Component, ViewChild } from '@angular/core';

import { Platform, IonMenu, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Capacitor, Plugins, Network } from '@capacitor/core';
import { AuthService } from './admin/users/auth.service';
import { Router } from '@angular/router';
import { UserModel } from './admin/users/user.model';
import { environment } from 'src/environments/environment';
import { SwUpdate } from '@angular/service-worker';
import { CacheSaveDataService } from './auth/cache-save-data.service';
import { RouteEventsService } from './shared/route-events.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('ionMenu', { static: true }) ionMenu: IonMenu;
  currentUser: any;
  version: string;
  status = null;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController,
    private swUpdate: SwUpdate,
    private cacheDataService: CacheSaveDataService,
    private routeEventsService: RouteEventsService

  ) {
    this.initializeApp();
    this.menuController = menuController;
    this.version = environment.appVersion.toString();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('Splashscreen')) {
        Plugins.SplashScreen.hide();
      }
    });

    this.currentUser = this.authService.getCurrentUser();
  }

  ionWillOpen() {
    this.currentUser = this.authService.getCurrentUser();
  }

  navMenu(val) {
    console.log (val);
    if (val === 'logout') {
      this.authService.logout().subscribe(val => {
        this.menuController.close();
        this.authService.backToLogin();
      });

    } else if (val === 'admin') {
      this.menuController.close();
      this.router.navigate(['admin']);

    } else if (val === 'home') {
      this.menuController.close();
      this.router.navigate(['welcome']);
    }
  }
}
