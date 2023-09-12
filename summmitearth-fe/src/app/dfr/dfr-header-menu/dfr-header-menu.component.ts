import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { DfrModel } from '../dfr-model';
import { DfrService } from '../dfr.service';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { LoadingController } from '@ionic/angular';
import { FilesService } from 'src/app/shared/genericfile/genericfile.service';

@Component({
  selector: 'app-dfr-header-menu',
  templateUrl: './dfr-header-menu.component.html',
  styleUrls: ['./dfr-header-menu.component.scss'],
})
export class DfrHeaderMenuComponent implements OnInit {
  isMobile = true;
  currentDFR: DfrModel;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private dfrService: DfrService,
    private cacheSaveDataService: CacheSaveDataService,
    private loadingController: LoadingController,
    private filesService: FilesService,
    private activatedRoute: ActivatedRoute)
    {
      this.isMobile = this.sharedService.isCellPhone();
      console.log(this.isMobile);
    }

  ngOnInit() {

  }

  moveTo(item) {
    console.log ('current dfr');
    this.dfrService.getCurrentDFR().subscribe(val => {
      this.currentDFR = val;
      this.navTo(item);
    }, (err) => {

   }, () => '');

  }

  navTo(item) {
    if (item === 'dfrSummary') {
      this.router.navigate(['tabs', 'dfr', this.currentDFR._id]);
    } else if (item === 'viewRigs') {
      this.router.navigate(['tabs', 'dfr', this.currentDFR._id, 'dfrrigs']);
    } else if (item === 'dailyMud') {
      this.router.navigate(['tabs', 'dfr', this.currentDFR._id, 'mud']);
    } else if (item === 'mudSummary') {
      this.router.navigate(['tabs', 'dfr', this.currentDFR._id, 'mudsummary']);
    } else if (item === 'dailyauditdwm') {
      this.router.navigate(['admin', 'dailyauditdwm']);
    }
  }

}
