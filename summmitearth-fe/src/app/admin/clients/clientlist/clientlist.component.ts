
import { ClientModel } from '../client.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, IonItemSliding, IonRefresher, AlertController, PopoverController, LoadingController } from '@ionic/angular';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription, Observable } from 'rxjs';
import { UserModel } from 'src/app/admin/users/user.model';
import { AuthService } from 'src/app/admin/users/auth.service';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';
import { DfrService } from 'src/app/dfr/dfr.service';
import { DfrModel } from 'src/app/dfr/dfr-model';
import { CalendarpickerComponent } from 'src/app/shared/calendarpicker/calendarpicker.component';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-clientlist',
  templateUrl: './clientlist.component.html',
  styleUrls: ['./clientlist.component.scss'],
})
export class ClientlistComponent implements OnInit {

  form: FormGroup;
  clients: ClientModel[];
  viewWidth = 576;
  sub: Subscription;
  constructor(
    private menuController: MenuController,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private authService: AuthService,
    private clientsService: ClientsService,
    private alertController: AlertController,
    private router: Router) {
     }

  ngOnInit() {

  }
  ionViewDidEnter() {
    this.getClients();
  }


  refreshPage(event: any, refresher: IonRefresher) {
    this.getClients();
    refresher.complete();
  }

  backToAdmin() {
    this.router.navigate(['admin']);
  }



  getClients() {
    this.sub = this.clientsService.getAllClients().subscribe((val: any) => {
      this.clients = val.data;
      this.sub.unsubscribe();
    });
  }

  editClient(client: ClientModel) {
    this.router.navigate(['admin', 'clients', 'id', client._id]);
  }



}
