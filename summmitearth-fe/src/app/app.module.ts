import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DfrService } from './dfr/dfr.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PopoverComponent } from './shared/popover/popover.component';
import { DfrRigService } from './dfr/daily-summary/dfrrig.service';
import { SharedService } from './shared/shared.service';
import { StaticlistService } from './shared/staticlist.service';
import { DailyMudService } from './dfr/daily-summary/daily-mud-list/daily-mud.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MudpickerComponent } from './shared/mudpicker/mudpicker.component';
import {CalendarModule} from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FileOpener } from '@ionic-native/file-opener/ngx';
//import { TooltipModule } from 'ng2-tooltip-directive';
import { NetworkstatusComponent } from './shared/networkstatus/networkstatus.component';
import { DevicestatusiconsComponent } from './shared/devicestatusicons/devicestatusicons.component';
import { NotificationComponent } from './shared/notification/notification.component';
import { NavmenuComponent } from './shared/navmenu/navmenu.component';
import { AuthService } from './admin/users/auth.service';
import {TableModule} from 'primeng/table';
import {TabMenuModule} from 'primeng/tabmenu';
import {MenuModule} from 'primeng/menu';
import { MenuItem} from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import { AuthInterceptor } from './auth/auth-interceptor';
import { TokenInterceptor } from './auth/token.interceptor';
import { AuthGuard } from './shared/guards/auth.guard';
import { SubmitGuard } from './shared/guards/submit.guard';
import { FilesService } from './shared/genericfile/genericfile.service';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import {ChartModule} from 'primeng/chart';
import { FieldticketoptionsService } from './admin/fieldticketoptions/fieldticketoptions.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { environment } from '../environments/environment';
import { FormlistService } from './formlist/formlist.service';
import { DailyauditdwmService } from './formlist/checklists/dailyauditdwm/dailyauditdwm.service';
import { GenericPhotoService } from './shared/genericphoto/genericphoto.service';
import { RouteEventsService } from './shared/route-events.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';





@NgModule({
  declarations: [AppComponent, PopoverComponent, MudpickerComponent, DevicestatusiconsComponent,
    NetworkstatusComponent, NotificationComponent],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__dfrdb',
      driverOrder: ['indexeddb', 'sqlite', 'localstorage']
    }),
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CalendarModule,
    InputSwitchModule,
    //TooltipModule,
    ChartModule,
    TableModule,
    TabMenuModule,
    MenuModule,
    DropdownModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    SubmitGuard,
    DfrService,
    DfrRigService,
    StaticlistService,
    SharedService,
    DailyMudService,
    AuthService,
    FilesService,
    FieldticketoptionsService,
    DailyauditdwmService,
    FormlistService,
    GenericPhotoService,
    RouteEventsService,
    StatusBar,
    SplashScreen,
    FileOpener,
    //FileTransfer,
    FileChooser,
    //File,
    FilePath,
    IOSFilePicker,
    ScreenOrientation,
    FileTransferObject,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
})
export class AppModule {}
