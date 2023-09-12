import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController, IonItemSliding, IonRefresher } from '@ionic/angular';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription, Observable } from 'rxjs';
import { UserModel } from './user.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @ViewChild('slidingItem') slidingItem: IonItemSliding;

  viewWidth = 1000;
  menuController: MenuController;
  sharedService: SharedService;
  authService: AuthService;
  router: Router;

  users: UserModel[];

  constructor(
    menuController: MenuController,
    sharedService: SharedService,
    authService: AuthService,
    router: Router
    ) {
    this.menuController = menuController;
    this.sharedService = sharedService;
    this.authService = authService;
    this.router = router;
   }

  ngOnInit() {

  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getUsers();
    refresher.complete();
  }

  ionViewWillEnter() {
    console.log ('view will enter');
    this.getUsers();
  }

  getUsers() {
    this.authService.getAllUsers().subscribe((val: any) => {
      this.users = val.data;
    });
  }

  updateUser(user: UserModel) {
    this.router.navigate(['admin', 'users', 'id', user._id]);
  }

  disableUser (user: UserModel) {
    
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
}

  backToAdmin() {
    this.router.navigate(['admin']);
  }

  addUser() {

  }

  itemClicked(item) {

  }



}
