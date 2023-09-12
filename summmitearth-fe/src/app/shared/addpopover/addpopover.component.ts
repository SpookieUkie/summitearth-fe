import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormGroupName, ControlContainer, FormGroupDirective } from '@angular/forms';
import { IonMenuToggle, LoadingController, PopoverController } from '@ionic/angular';
import { UserModel } from 'src/app/admin/users/user.model';
import { CacheSaveDataService } from 'src/app/auth/cache-save-data.service';
import { GeneralService } from 'src/app/dwm/general/general.service';
import { SharedService } from '../shared.service';
import { TechpickerComponent } from '../techpicker/techpicker.component';

@Component({
  selector: 'app-addpopover',
  templateUrl: './addpopover.component.html',
  styleUrls: ['./addpopover.component.scss'],
  viewProviders: [
    {
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
})
export class AddpopoverComponent implements OnInit {
  @Input() sectionTitle: string;
  @Input() fieldName: string;
  @Input() fieldId: string;
  @Input() inlineFormGroup: FormGroup;
  @Input() form: FormGroup;
  @Input() inlineFormGroupName: FormGroupName;
  @Input() isMobileDevice: boolean;
  @Input() dataSet: [];
  @Input() techNameValue: string;
  @Input() techIdValue: string;


  constructor(
    private cacheSaveDataService: CacheSaveDataService,
    private popoverController: PopoverController,
    private loadingController: LoadingController,
    private sharedService: SharedService,
    private generalService: GeneralService,
  ) { }

  ngOnInit() {
    this.setView();

  }

  setView() {
    this.generalService.getCurrentGen().subscribe((val: any) => {
      //this.currentRec = val;
      if (val[this.fieldName] !== null && val[this.fieldName] !== undefined) {
        this.inlineFormGroup.get(this.fieldName).setValue(val[this.fieldName]);
      }
      if (val[this.fieldId] !== null && val[this.fieldId] !== undefined) {
        this.inlineFormGroup.get(this.fieldId).setValue(val[this.fieldId])
      }
      //console.log ('got form');
    }, (err) => '', () => console.log ('tech done'));
  }

  showPopup() {
    if (!this.isMobileDevice) {
      this.presentTechPopover(null);
    }
  }


  async presentTechPopover(event) {
  
    const popover = await this.popoverController.create({
        component: TechpickerComponent,
       // event: event,
        cssClass: 'mudPopover',
        translucent: true,
        componentProps: {
          currentName: '',
          userList: this.dataSet,
          userName: this.fieldName
        }
      });
   popover.onDidDismiss().then(val => {
        if (val.data !== undefined) {
          const user = <UserModel> val.data;
          this.inlineFormGroup.get(this.fieldName).setValue(user.firstName + ' ' + user.lastName);
          this.inlineFormGroup.get(this.fieldId).setValue(user._id);
          this.inlineFormGroup.markAsDirty();
        }
    });
    return await popover.present();
  }

}
