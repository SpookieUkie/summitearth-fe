import { Component, OnInit, Input } from '@angular/core';
import { DailyMudModel } from '../../daily-summary/daily-mud/daily-mud.model';

@Component({
  selector: 'app-mud-summary-item',
  templateUrl: './mud-summary-item.component.html',
  styleUrls: ['./mud-summary-item.component.scss'],
})
export class MudSummaryItemComponent implements OnInit {
  @Input() mud: DailyMudModel;

  constructor() { }

  ngOnInit() {}

}
