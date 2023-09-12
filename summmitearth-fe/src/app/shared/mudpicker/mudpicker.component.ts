import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, NavParams, PopoverController } from '@ionic/angular';
import { StaticlistService } from '../staticlist.service';

@Component({
  selector: 'app-mudpicker',
  templateUrl: './mudpicker.component.html',
  styleUrls: ['./mudpicker.component.scss'],
})
export class MudpickerComponent implements OnInit {
  @ViewChild('ionSearchBox', { static: true }) ionSearchBox: IonSearchbar;

  
  mudList: any[];
  filteredMudList: any[];
  showResults = false;
  selectedMud: string;
  currentProduct: string;

  constructor(
    private staticlistsService: StaticlistService,
    private navParams: NavParams,
    private popoverController: PopoverController) { }

  ngOnInit() {
      this.currentProduct = this.navParams.get('mudProduct');
      this.staticlistsService.getMudProductsList().subscribe(list => {
      this.mudList = list;
      this.filteredMudList = list;
      this.ionSearchBox.setFocus();
      this.ionSearchBox.value = this.currentProduct;
      setTimeout(() => {
        this.ionSearchBox.setFocus();
      }, 500);
    });
    
  }

  setFilter(event) {
    const val = event.target.value.toUpperCase();
    if (val.length > 1) {
       this.filteredMudList = this.mudList
           .filter((item) => item.mudProductName.toUpperCase().includes(val));
       this.showResults = true;
     } else {
       this.showResults = false;
       this.filteredMudList = this.mudList;
     }
 }

 itemClicked(item) {
   this.selectedMud = item;
   this.ionSearchBox.value = item.mudProductName;
   this.showResults = false;
   this.closeModal();
 }

 itemCleared(item) {
  this.selectedMud = null;
  this.closeModal();
  //this.ionSearchBox.value = ""
}

 async closeModal() {
  console.log ('Close Modal');
  console.log (this.ionSearchBox.value);
  
  await this.popoverController.dismiss(this.selectedMud);
 }

}
