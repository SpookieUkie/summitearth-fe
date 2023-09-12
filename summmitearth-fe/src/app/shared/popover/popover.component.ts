import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  message: string;
  title: string;
  constructor(private navParams: NavParams) {
    this.message = navParams.data.message;
    this.title = navParams.data.title;
  }

  ngOnInit() {}

}
