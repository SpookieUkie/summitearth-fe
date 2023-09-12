import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, NavParams, PopoverController } from '@ionic/angular';
import { StaticlistService } from '../staticlist.service';

@Component({
  selector: 'app-genericpicker',
  templateUrl: './genericpicker.component.html',
  styleUrls: ['./genericpicker.component.scss'],
})
export class GenericPickerComponent implements OnInit {
  @ViewChild('ionSearchBox', { static: true }) ionSearchBox: IonSearchbar;

  showResults = false;

  // Nav Params
  list: any[];
  filteredList: any[];
  selectedItem: any;
  currentItem: string;
  currentValue: string;
  filterBy: string;
  pickerTitle: string;

  constructor(
    private staticlistsService: StaticlistService,
    private navParams: NavParams,
    private popoverController: PopoverController) { }

  ngOnInit() {
      console.log('Generic Picker');
      this.currentItem = this.navParams.get('currentItem');
      this.currentValue = this.navParams.get('currentValue');
      this.filterBy = this.navParams.get('filterBy');
      this.list = this.navParams.get('currentList');
      this.pickerTitle = this.navParams.get('pickerTitle');
      this.filteredList = this.list;

      this.ionSearchBox.setFocus();
      this.ionSearchBox.value = this.currentValue;
      setTimeout(() => {
        this.ionSearchBox.setFocus();
      }, 500);

  }

  setFilter(event) {
    const val = event.target.value.toUpperCase();
    if (val.length > 1) {
       this.filteredList = this.list
           .filter((item) => item[this.filterBy].toUpperCase().includes(val));
       this.showResults = true;
     } else {
       this.showResults = false;
       this.filteredList = this.list;
     }
 }

 itemClicked(item) {
   this.selectedItem = item;
   this.ionSearchBox.value = item['filterBy'];
   this.showResults = false;
   this.closeModal();
 }

 itemCleared(item) {
  this.selectedItem = null;
  this.closeModal();
  //this.ionSearchBox.value = ""
}

 async closeModal() {
  console.log ('Close Modal');
  console.log (this.ionSearchBox.value);
  
  await this.popoverController.dismiss(this.selectedItem);
 }

}
