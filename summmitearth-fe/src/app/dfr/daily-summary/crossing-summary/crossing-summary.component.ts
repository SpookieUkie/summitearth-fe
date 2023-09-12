import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-crossing-summary',
  templateUrl: './crossing-summary.component.html',
  styleUrls: ['./crossing-summary.component.scss'],
})
export class CrossingSummaryComponent implements OnInit {
  @Input() crossing;
  @Input() index;

  constructor() { }

  ngOnInit() {}

}
