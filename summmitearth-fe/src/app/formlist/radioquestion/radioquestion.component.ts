import { Component, OnInit, Input, AfterViewInit, OnDestroy, DoCheck, OnChanges } from '@angular/core';
import { FormControlName, ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { SharedService } from 'src/app/shared/shared.service';
import { NaPopupNoteComponent } from './na-popup-note/na-popup-note.component';
import { DailyauditdwmService } from '../checklists/dailyauditdwm/dailyauditdwm.service';

@Component({
  selector: 'app-radioquestion',
  templateUrl: './radioquestion.component.html',
  styleUrls: ['./radioquestion.component.scss'],
  viewProviders: [
    {
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }
]
})
export class RadioquestionComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() sectionTitle: string;
  @Input() fieldName: string;
  @Input() inlineFormGroup: FormGroup;
  @Input() isMobileDevice: boolean;
  @Input() showNA = true;
  @Input() fieldGroupName =  '';
  @Input() popupNote = '';

  selectedNA = false;

  constructor(
    private modalController: ModalController,
    private sharedService: SharedService,
    private dailyAuditDwmService: DailyauditdwmService
  ) {
  }



  ngOnInit() {
   
  }


  //Required when data is loaded after the view
  ngOnChanges() {
    if (this.inlineFormGroup.get(this.fieldName).value === 'N/A') {
      this.selectedNA = true;
      this.popupNote = this.dailyAuditDwmService.getNaNoteByKey(this.fieldName);
      this.getNoteClass();
    }
  }
  
/*
// Very expensive
ngDoCheck() {
  if (this.inlineFormGroup.get(this.fieldName).value === 'N/A') {
    this.selectedNA = true;
    this.getNoteClass();
  }
}*/

  ngAfterViewInit() {
    /*setTimeout(() => {
      //console.log(this.fieldName);
      //console.log(this.inlineFormGroup.get(this.fieldName).value);
      if (this.inlineFormGroup.get(this.fieldName).value === 'N/A') {
        this.selectedNA = true;
        this.getNoteClass();
      }
    }, 500); */
  }

  async presentNotePopup(data) {
  
    const alert = await this.modalController.create({
        component: NaPopupNoteComponent,
        backdropDismiss: false,
        componentProps: {
          'sectionTitle': this.sectionTitle,
          'popupNote': this.popupNote
        },
        cssClass: 'naPopupNote'

    });

    await alert.present();

    alert.onDidDismiss().then (val => {
        console.log ('hello');
        console.log (val);
        this.popupNote = val.data;
        this.dailyAuditDwmService.updateNaNotes(this.fieldName, val.data, this.sectionTitle);
        this.inlineFormGroup.markAsDirty();
    });
  }


  showHideNote(val) {
    this.selectedNA = val;
  }

  getErrorClass() {
    if (this.isMobileDevice) {
      return 'radioErrorIos';
    } else {
      return 'radioErrorWeb';
    }
  }

  getNoteClass() {
    if (this.popupNote === null || this.popupNote === undefined || this.popupNote === '') {
      return 'noteError';
    } else {
      return 'noteCorrect';
    }
  }

  

}
