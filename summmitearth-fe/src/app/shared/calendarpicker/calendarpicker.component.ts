import { Component, OnInit, ViewChild } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import * as moment from "moment";


@Component({
  selector: 'app-calendarpicker',
  templateUrl: './calendarpicker.component.html',
  styleUrls: ['./calendarpicker.component.scss'],
})
export class CalendarpickerComponent implements OnInit {
  @ViewChild('myCalendar', { static: true }) calendar;
  display: boolean = false;
  hideClear = false;
  ev;
  refDate;


  constructor( 
    private navParams: NavParams, 
    private popoverController: PopoverController) { 
  }

  ngOnInit() {
    console.log ('Calendar popup ')
    
    this.ev = this.navParams.get('event');
    this.refDate = this.navParams.get('refDate');
    this.hideClear = this.navParams.get ('hideClear');
    console.log(this.refDate);
    if (this.refDate !== null && this.refDate !== undefined &&  this.refDate !== "") {
      this.refDate = moment(this.refDate).toDate();
      this.calendar.value = this.refDate;
    } else {
      this.refDate = moment(new Date).toDate();
      this.calendar.value = this.refDate;
    }
    this.showDialog();
  }

  showDialog() {
    this.display = true;
    setTimeout(() => {
      this.calendar.showOverlay(this.calendar.nativeElement);
      this.ev.stopPropagation();
    }, 0);
  }

  async saveDate() {
    console.log ('format')
    console.log (this.calendar);
    console.log (this.calendar.value);
    this.refDate = this.calendar.value;
    const val = moment(this.calendar.value).format();
    await this.popoverController.dismiss(val);
  }

  async clearValue() {
    this.calendar.value = null;
    await this.popoverController.dismiss('clear');
  }


}
