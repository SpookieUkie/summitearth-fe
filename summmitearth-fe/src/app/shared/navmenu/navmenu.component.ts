import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.scss'],
})
export class NavmenuComponent implements OnInit {

  constructor( 
    private menuController: MenuController) {
  }

  ngOnInit() {}


  openMenu() {
    this.menuController.enable(true, 'first');
    this.menuController.open('first');
 }
}
