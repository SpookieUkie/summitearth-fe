import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, NavParams, PopoverController } from '@ionic/angular';
import { StaticlistService } from '../staticlist.service';
import { AuthService } from 'src/app/admin/users/auth.service';


@Component({
  selector: 'app-techpicker',
  templateUrl: './techpicker.component.html',
  styleUrls: ['./techpicker.component.scss'],
})
export class TechpickerComponent implements OnInit {
  @ViewChild('ionSearchBox', { static: true }) ionSearchBox: IonSearchbar;

  userList: any[];
  filteredUserList: any[];
  showResults = false;
  selectedMud: string;
  currentUser: string;
  userName: string;
  userId: string;

  constructor(
    private authService: AuthService,
    private navParams: NavParams,
    private popoverController: PopoverController) {}

  ngOnInit() {
      this.setView();
  }
  
  ionViewWillEnter() {
    this.setView();
  }

  setView() {
    this.userName = this.navParams.get('fieldName');
      //this.ionSearchBox.setFocus();
      this.ionSearchBox.value = this.userName;
      if (this.navParams.get('dataSet') !== null && this.navParams.get('fieldName') !== undefined) {
        this.userList = this.navParams.get('dataSet')
      } else {
          this.authService.getAllUsers().subscribe((list: any) => {
            this.userList = list.data;
            this.filteredUserList = list.data;
            this.ionSearchBox.setFocus();
            this.ionSearchBox.value = this.currentUser;
          setTimeout(() => {
            this.ionSearchBox.setFocus();
          }, 500);
        });
    }
    console.log ('tech picker');
  }

  setFilter(event) {
    const val = event.target.value.toUpperCase();
    console.log (val);
    if (val.length > 1) {
       this.filteredUserList = this.userList
           .filter((item) => item.firstName.toUpperCase().includes(val) || item.lastName.toUpperCase().includes(val));
       this.showResults = true;
     } else {
       this.showResults = false;
       this.filteredUserList = this.userList;
     }
 }

 itemClicked(item) {
   console.log(item);
   this.currentUser = item;
   this.ionSearchBox.value = item._id;
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
  
  await this.popoverController.dismiss(this.currentUser);
 }

}
