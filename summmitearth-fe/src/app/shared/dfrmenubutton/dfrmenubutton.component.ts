import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DfroptionsComponent } from '../dfroptions/dfroptions.component';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-dfrmenubutton',
  templateUrl: './dfrmenubutton.component.html',
  styleUrls: ['./dfrmenubutton.component.scss'],
})
export class DfrmenubuttonComponent implements OnInit {
  @Input() currentPage: string;
  @Output() menuItemSelected = new EventEmitter();

  constructor(
    private popoverController: PopoverController) {
  }

  ngOnInit() {}

  async showTopMenu(event) {
    console.log ('top menu');
    const popover = await this.popoverController.create({
      component: DfroptionsComponent,
      event: event,
      translucent: true,
      mode: 'ios',
      cssClass: 'dfrMenuPopover'
    });
    return await popover.present();
  }

  menuItem() {
    
  }

  


}
