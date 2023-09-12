import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../admin/users/auth.service';
import { SharedService } from '../shared/shared.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IonLabel, Platform, IonButton } from '@ionic/angular';
import { Plugins, Browser } from '@capacitor/core';
import { Subscription } from 'rxjs';
//import { cordova} from '../../../node_modules/cordova-plugin-exit';


const { App } = Plugins;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  authService: AuthService;
  sharedService: SharedService;
  router: Router;
  platform: Platform;
  isCurrent = true;
  status = 'Sign In';
  buttonLabel = 'Log In';
  subscription: Subscription;
  isMobile: boolean;
  isProduction: boolean = false;
  
  constructor(
    authService: AuthService,
    sharedService: SharedService,
    router: Router,
    platform: Platform
  ) {
    this.authService = authService;
    this.sharedService = sharedService;
    this.router = router;
    this.platform = platform;

    this.viewWidth = this.sharedService.getPlaformWidth();
    this.isMobile = this.sharedService.isMobileDevice();
    this.isProduction = environment.production;
  }

  form: FormGroup;
  viewWidth = 10000;

  ngOnInit() {

    this.form = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });

      // Check if mobile only
      this.authService.validateAppVersion().subscribe((val: any) => {
        console.log ('data');
        console.log (val.data);
        const message = 'Application is out date. Please clear the browser cache or reinstall the application.';
       if (val.data !== environment.appVersion) {
          this.isCurrent = false;
          this.status = 'Invalid Version';
          this.sharedService.showAlert(message, 'Error Validating Application');
          if (!this.isMobile) {
             this.buttonLabel = 'Clear Browser Cache';
          } else {
             this.buttonLabel = 'Update application';
          }
        }
        
      });

  }

  async closeApp() {
    /*navigator['app'].exitApp();
    let val = await App.exitApp();
    console.log ('exit');
    console.log (val);*/
    let url = 'https://dfrapp.summitearth.com/';
    Browser.open({ 'url': url });
  }

  login() {

    if (!this.isCurrent) {
      let url = 'https://dfrapp.summitearth.com/';
      Browser.open({ 'url': url });
    } else {

      this.authService.signinUser(this.form.value.username, this.form.value.password).subscribe((val: any) => {
        console.log('val.data');
        console.log(val.data);
        if (val) {
        this.sharedService.showNotification('Login Successful! Redirecting to Daily Field Report List');
        this.router.navigate(['welcome']);
        } else {
          this.sharedService.showNotification('Invalid Login Attempt. Please try again', 'danger');
          //this.form.value.username = '';
          //this.form.value.password = '';
        }
      }, err => {
        this.sharedService.showNotification('Invalid Login Attempt. Please try again', 'danger');
        //this.form.value.username = '';
        //this.form.value.password = '';
      });
    }
  }


  ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(()=>{
        console.log ('back pressed');
        //navigator['app'].exitApp();
        //cordova.plugins.exit();
        //navigator.app.exitApp();
    });
  }

  ionViewWillLeave(){
      this.subscription.unsubscribe();
  }



}
