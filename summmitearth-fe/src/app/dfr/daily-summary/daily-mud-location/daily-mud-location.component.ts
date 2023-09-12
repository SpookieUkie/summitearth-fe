import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DailyMudLocationModel } from '../daily-mud/daily-mud-location.model';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-daily-mud-location',
  templateUrl: './daily-mud-location.component.html',
  styleUrls: ['./daily-mud-location.component.scss'],
})
export class DailyMudLocationComponent implements OnInit {
  @Input() mudLocation: DailyMudLocationModel;
  @Input() index: number;
  @Output() valueChanged = new EventEmitter();
  @ViewChild('mudTotal', { static: true }) mudTotal: IonInput;

  constructor() { }

  ngOnInit() {}

  setValue() {
    console.log('on change');
    this.mudLocation.total = Number(this.mudTotal.value);
    this.valueChanged.emit({_id: this.mudLocation._id, total: this.mudLocation.total});
  }
}
