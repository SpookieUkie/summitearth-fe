import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarpickerComponent } from './calendarpicker/calendarpicker.component';
import {CalendarModule} from 'primeng/calendar';
import { IonicModule } from '@ionic/angular';
import { CalendarforlistComponent } from './calendarforlist/calendarforlist.component';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { NetworkstatusComponent } from './networkstatus/networkstatus.component';
import { NotificationComponent } from './notification/notification.component';
import { DfroptionsComponent } from './dfroptions/dfroptions.component';
import { DfrmenubuttonComponent } from './dfrmenubutton/dfrmenubutton.component';
import { DevicestatusiconsComponent } from './devicestatusicons/devicestatusicons.component';
import { NavmenuComponent } from './navmenu/navmenu.component';
import { TechpickerComponent } from './techpicker/techpicker.component';
import { FieldoptionpickerComponent } from './fieldoptionpicker/fieldoptionpicker.component';
import { TabMenuModule } from 'primeng/tabmenu';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GenericPhotoComponent } from './genericphoto/genericphoto.component';
import { CameraComponent } from './camera/camera.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PhotoviewerComponent } from './photoviewer/photoviewer.component';
//import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { SignatureComponent } from './signature/signature.component';
import { GenericFileComponent } from './genericfile/genericfile.component';
import { PillYesNoComponent } from './pillyesno/pillyesno.component';
import { NaPopupNoteComponent } from '../formlist/radioquestion/na-popup-note/na-popup-note.component';
import { GenericPickerComponent } from './genericpicker/genericpicker.component';
import { CalendarforformComponent } from './calendarforform/calendarforform.component';
import { RadioquestionComponent } from '../formlist/radioquestion/radioquestion.component';
import { TextinputComponent } from './textinput/textinput.component';
import { PillYesNoRootComponent } from './pillyesnoroot/pillyesnoroot.component';
import { AddpopoverComponent } from './addpopover/addpopover.component';

@NgModule({
  declarations: [CalendarpickerComponent, CalendarforlistComponent, GeolocationComponent, FieldoptionpickerComponent,
    DfroptionsComponent, DfrmenubuttonComponent, NavmenuComponent, TechpickerComponent, GenericPhotoComponent, CameraComponent,
     SignatureComponent, PhotoviewerComponent, GenericFileComponent, PillYesNoComponent, NaPopupNoteComponent, 
    GenericPickerComponent, CalendarforformComponent, RadioquestionComponent, TextinputComponent, PillYesNoRootComponent,
  AddpopoverComponent],
    //SignaturePad,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    CalendarModule,
    TabMenuModule,
    TableModule,
    TabViewModule,
    DropdownModule,
    ButtonModule,
    RadioButtonModule,
  ],
  exports: [
    CalendarpickerComponent, CalendarforlistComponent, GeolocationComponent, DfroptionsComponent, GenericPhotoComponent,
    DfrmenubuttonComponent, NavmenuComponent, TechpickerComponent, CalendarModule, RadioButtonModule, CameraComponent,
    PhotoviewerComponent,  SignatureComponent, GenericFileComponent, PillYesNoComponent, NaPopupNoteComponent,
    GenericPickerComponent, CalendarforformComponent, RadioquestionComponent, TextinputComponent, PillYesNoRootComponent,
  AddpopoverComponent]
    //SignaturePad,
})
export class SharedModule { }
