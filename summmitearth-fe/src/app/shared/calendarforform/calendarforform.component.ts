import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormGroupName } from '@angular/forms';
import { IonInput, PopoverController } from '@ionic/angular';
import { CalendarpickerComponent } from '../calendarpicker/calendarpicker.component';

@Component({
  selector: 'app-calendarforform',
  templateUrl: './calendarforform.component.html',
  styleUrls: ['./calendarforform.component.scss'],
  viewProviders: [
    {
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
})
export class CalendarforformComponent implements OnInit {
  @ViewChild('refDate') refDate: IonInput;
  popover;

  @Input() sectionTitle: string;
  @Input() fieldName: string;
  @Input() inlineFormGroup: FormGroup;
  @Input() inlineFormGroupName: FormGroupName;
  @Input() isMobileDevice: boolean;
  
  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
    console.log (this.fieldName);
  }

  async showCalendar (event, dateToUse) {
    console.log('Calendar');
   this.popover = await this.popoverController.create({
        component: CalendarpickerComponent,
        event: event,
        cssClass: 'calendarPopover',
        translucent: true,
        componentProps: {
          refDate: dateToUse,
          hideClear: true,
          event: event
        }
    });
    this.popover.onDidDismiss().then(val => {
        console.log (val);
       // console.log(this.inlineFormGroup.value[this.fieldName]);
        if (val.data === 'clear') {
          this.inlineFormGroup.value[this.fieldName]  = null;
          this.refDate.value = null;
        } else if (val.data !== null && val.data !== undefined) {
          this.inlineFormGroup.value[this.fieldName]  = val.data;
          this.refDate.value = val.data.substring(0, 10);
         // this.dailyAuditDwmModel.inspectionDate = val.data;
          console.log(this.inlineFormGroup.value[this.fieldName]);
        }
    });

    return await this.popover.present();
  }

}
