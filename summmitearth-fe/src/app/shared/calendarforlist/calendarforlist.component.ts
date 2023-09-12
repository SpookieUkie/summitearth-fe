import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CalendarpickerComponent } from '../calendarpicker/calendarpicker.component';
import { PopoverController, IonInput } from '@ionic/angular';

@Component({
  selector: 'app-calendarforlist',
  templateUrl: './calendarforlist.component.html',
  styleUrls: ['./calendarforlist.component.scss'],
})
export class CalendarforlistComponent implements OnInit {
  @Input() dateRef;
  @Input() compRef: string;
  @Input() index: number;
  @Input() dateLabel: string;
  @Input() hideLabel = false;
  @Output() newDateRef = new EventEmitter();
  @ViewChild('myDate', { static: true }) myDate: IonInput;

  dateVal;
  constructor(private popoverController: PopoverController) {
   
  }

  ngOnInit() {
    if (this.dateRef !== null) {
      this.dateVal = this.dateRef.substring(0, 10);
    } else {
      this.dateVal = new Date();
    }
    
  }
    
  async showCalendar (event) {
    console.log('Calendar');
    const popover = await this.popoverController.create({
        component: CalendarpickerComponent,
        event: event,
        cssClass: 'calendarPopover',
        translucent: true,
        componentProps: {
          refDate: this.myDate.value,
          event: event
        }
      });
    popover.onDidDismiss().then(val => {
        if (val.data === 'clear') {
          this.dateVal = null;
          this.myDate.value = null;
          this.newDateRef.emit({date: this.dateVal, comp: this.compRef, pos: this.index});
        } else if (val.data !== null && val.data !== undefined) {
          this.dateRef = val.data;
          this.myDate.value  = val.data.substring(0, 10);
          this.newDateRef.emit({date: this.dateRef, comp: this.compRef, pos: this.index});
        } else {
          // Do Nothing
        }
    });
    return await popover.present();
  }

}
