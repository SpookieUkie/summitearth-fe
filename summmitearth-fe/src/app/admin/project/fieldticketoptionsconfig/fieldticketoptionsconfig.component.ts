import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FieldTicketOptionsModel } from '../../fieldticketoptions/fieldticketoptions.model';

@Component({
  selector: 'app-fieldticketoptionsconfig',
  templateUrl: './fieldticketoptionsconfig.component.html',
  styleUrls: ['./fieldticketoptionsconfig.component.scss'],
})
export class FieldticketoptionsconfigComponent implements OnInit {
  @Input() fieldTicketOptionsModel: FieldTicketOptionsModel;
  @Input() isMobileDevice: Boolean;
  
  form: FormGroup;
 

  constructor() { }

  ngOnInit() {

    this.form = new FormGroup({
      _id: new FormControl(null, {
        updateOn: 'blur',
      }),
      chargeLabel: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      unitType: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      defaultQty: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      clientCost: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      qtyIncluded: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      equipmentCost: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      percentMarkup: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      showByDefault: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      isActive: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
   //this.ionViewWillEnter();
   this.setFormValues();
  }


  ionViewWillEnter() {
    
  }


  setFormValues() {
    for (const i in this.form.controls) {
        this.form.get(i).setValue(this.fieldTicketOptionsModel[i]);
    }
  }
}
