import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ManageConfigService } from '../../manageconfig.service';
import { PopoverController, LoadingController, IonItemSliding, IonRefresher, MenuController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from 'rxjs';
import { StaticlistService } from 'src/app/shared/staticlist.service';
import { ProjectTypeModel } from '../projecttype.model';
import { ClientsService } from '../../clients/clients.service';

@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss'],
})
export class ProjectlistComponent implements OnInit {

  form: FormGroup;
  projectList: any[];
  viewWidth = 0;
  sub: Subscription;
  projectTypes: [];
  constructor(
    private manageConfigService: ManageConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private staticListService: StaticlistService,
    private clientsService: ClientsService
    ) {
    this.viewWidth = this.sharedService.getPlaformWidth();
  }

  ngOnInit() {
    this.form = new FormGroup({
      startDate: new FormControl(null, {
        updateOn: 'blur',
      }),
      endDate: new FormControl(null, {
        updateOn: 'blur',
      })
    });

    let val = new Date();
    val.setDate(val.getDate() - 90);
    this.form.get('startDate').setValue(val.toISOString());
    //val.setDate(val.getDate() + 120);
    //this.form.get('endDate').setValue(val.toISOString());
    this.form.updateValueAndValidity();

    this.getProjectList();
  }

  ionViewDidEnter() {
    console.log ('ion view did enter');
    this.getProjectList();
    this.getProjectTypes();
    this.getStaticLists();
  }

  getStaticLists() {
    this.staticListService.getListCollection('rrr');
    this.staticListService.getListCollection('any');
    this.clientsService.getClientsByGroup();
  }

  getProjectTypes() {
    this.staticListService.getListTypeForAny('projectType').subscribe(val => {
      this.projectTypes = val;
    }, (err) => '',
        () => '');
  }

  async getProjectList() {
    console.log ('PROJECT LIST' + this.form.value.startDate)
    const loader = await this.loadingController.create({
      message: 'Loading Daily Field Reports, One Moment.',
      animated: true
    }).then(loaderElement => {
      loaderElement.present();
      this.manageConfigService.getProjectListByDate(this.form.value.startDate, this.form.value.endDate).subscribe(val => {
        this.projectList = val;
        this.projectList.forEach((val: ProjectTypeModel) => {
          if (val.projectType === null || val.projectType === undefined) {
            val.projectType = 'DFR - EPM';
          }
        });
        console.log(this.projectList);
        loaderElement.remove();
      });
    });
  }

  editProject (item: any) {
    this.itemClicked(item);
  }

  itemClicked (item: any) {
    this.manageConfigService.currentProjectType.next(item);
    this.router.navigate(['admin', 'project', item._id]);
  }

  backToAdmin() {
    this.router.navigate(['admin']);
  }


  copyProject (item: any) {

  }

  refreshPage(event: any, refresher: IonRefresher) {
    this.getProjectList();
    refresher.complete();
  }

 updateDate(data) {
    if (data.comp === 'startDate') {
      this.form.value.startDate = data.date;
    } else {
      this.form.value.endDate = data.date;
    }
  }
}
