import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController, IonItem, IonSearchbar, PopoverController, IonInput } from '@ionic/angular';
import { MudpickerComponent } from 'src/app/shared/mudpicker/mudpicker.component';
import { FieldoptionpickerComponent } from 'src/app/shared/fieldoptionpicker/fieldoptionpicker.component';
import { ManageConfigService } from '../manageconfig.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectTypeModel } from '../project/projecttype.model';

@Component({
  selector: 'app-fieldticketbuilder',
  templateUrl: './fieldticketbuilder.component.html',
  styleUrls: ['./fieldticketbuilder.component.scss'],
})
export class FieldticketbuilderComponent implements OnInit {

  form: FormGroup;
  isMobileDevice: Boolean;
  projectTypeModel: ProjectTypeModel;

  mainItems: [];


  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private manageConfigService: ManageConfigService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
    ) {
    }

  ngOnInit() {
    this.form = new FormGroup({

    });
  }

  ionViewWillEnter() {
    console.log ('ion vid');
    this.activatedRoute.paramMap.subscribe(paramMap => {
          if (paramMap.has('id')) {
            const firstId = paramMap.get('id').split(',')[0];
            this.manageConfigService.getProjectByProjectId(firstId).subscribe((val2: any) => {
              this.projectTypeModel = val2.data;
            });
          }
      });
    }

  async showItemPicker(val) {

    const popover = await this.popoverController.create({
        component: FieldoptionpickerComponent,
       // event: event,
        cssClass: 'mudPopover',
        translucent: true,
        componentProps: {
          mudProduct: this.form.value.productName,
          list: this.projectTypeModel.fieldTicketOptions
        }
      });
    popover.onDidDismiss().then(val => {
      console.log (val);
        if (val.data !== undefined) {
          // Set values

        }
    });
    return await popover.present();
  
  }

  addItem(val) {
    
  }

  itemsReordered(event) {
    
  }
}
