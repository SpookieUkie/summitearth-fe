import { Component, OnInit } from '@angular/core';
import { FieldticketoptionsService } from '../fieldticketoptions.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PopoverController, LoadingController, AlertController, NavController, IonRefresher } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../users/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { FieldTicketOptionsModel } from '../fieldticketoptions.model';

@Component({
  selector: 'app-fieldticketoptionslist',
  templateUrl: './fieldticketoptionslist.component.html',
  styleUrls: ['./fieldticketoptionslist.component.scss'],
})
export class FieldticketoptionslistComponent implements OnInit {


  form: FormGroup;
  popoverController: PopoverController;
  loadingController: LoadingController;
  alertController: AlertController;
  activatedRoute: ActivatedRoute;
  authService: AuthService;
  sharedService: SharedService;
  navController: NavController;
  fieldticketoptionsService: FieldticketoptionsService;
  router: Router;
  ftoptions: FieldTicketOptionsModel[];

  constructor(
    fieldticketoptionsService: FieldticketoptionsService,
    authService: AuthService,
    sharedService: SharedService,
    popoverController: PopoverController,
    loadingController: LoadingController,
    alertController: AlertController,
    activatedRoute: ActivatedRoute,
    navController: NavController,
    router: Router,
    ) {
      this.fieldticketoptionsService = fieldticketoptionsService;
      this.authService = authService;
      this.sharedService = sharedService;
      this.popoverController = popoverController;
      this.loadingController = loadingController;
      this.alertController = alertController;
      this.activatedRoute = activatedRoute;
      this.navController = navController;
      this.router = router;
    }

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.getFieldTicketList();
  }

  viewOption(opt) {
    this.router.navigate(['admin', 'fieldticketoptions', 'id', opt._id]);
  }

  getFieldTicketList() {
    this.fieldticketoptionsService.getAllFieldTicketOptions().subscribe((val: any) => {
      this.ftoptions = val.data;
    });
  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getFieldTicketList();
    refresher.complete();
  }


  backToAdmin() {

  }

}
