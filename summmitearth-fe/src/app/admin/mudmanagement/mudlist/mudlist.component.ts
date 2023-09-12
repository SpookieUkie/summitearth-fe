import { Component, OnInit, ViewChild, ElementRef, getModuleFactory, Output, EventEmitter } from '@angular/core';
import { MenuController, IonItemSliding, IonRefresher, AlertController, PopoverController, LoadingController } from '@ionic/angular';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/admin/users/auth.service';
import { Router } from '@angular/router';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { FormGroup } from '@angular/forms';
import { MudProductModel } from '../mudProduct.model';


@Component({
  selector: 'app-mudlist',
  templateUrl: './mudlist.component.html',
  styleUrls: ['./mudlist.component.scss'],
})
export class MudlistComponent implements OnInit {
  @Output() itemSelected =  new EventEmitter<any>();
  mudList: any[];


  constructor(
    private menuController: MenuController,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private authService: AuthService,
    private staticlistsService: StaticlistService,
    private alertController: AlertController,
    private router: Router) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    console.log ('Get Mud');
    this.getMud();
  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getMud();
    refresher.complete();
  }

  getMud() {
    this.staticlistsService.getMudProductsList(true).subscribe(list => {
      this.mudList = list;
    });
  }

  backToAdmin() {
    this.router.navigate(['admin']);
  }

  async disableMud(item: MudProductModel) {
    console.log( 'Disable Item: ' + item);

    const alert = await this.alertController.create({
      message: 'Are you sure you want to disable this mud product?',
      buttons: [
        {text: 'Yes',
        handler: (i) => {
          item.isDisabled = true;
          this.staticlistsService.updateMudProduct(item).subscribe(val => {
              console.log ('Delete request complete');
              this.sharedService.showNotification('Mud Item Disabled');
              this.getMud();
          });
        }},
        {text: 'No', handler: (val) => {
          console.log('Do Nothing');
        }}
    ],
      header: 'Disable Mud Product'
    }).then(alertElement => {
      alertElement.present();
    });
  }

  viewMud(mud: any) {
    this.router.navigate(['admin', 'muds', 'id', mud._id]);
  }

  addMud() {
    this.router.navigate(['admin', 'muds', 'add']);
  }

}
