import { FormControl, Validators, FormArray } from '@angular/forms';
import { DailyMudModel } from './daily-mud.model';
import { DailyMudLocationModel } from './daily-mud-location.model';

export class DailyMudFormModel {

    _id = new FormControl();
    dfrId = new FormControl();
    productName = new FormControl();
    size = new FormControl();
    toxicity = new FormControl();
    locations = new FormControl(); //new FormArray([]); //new Array<DailyMudLocationModel>(); //


    constructor(mud: DailyMudModel) {
        this._id.setValue(mud._id);

        this.dfrId.setValue(mud.dfrId);
        this.dfrId.setValidators([Validators.required]);

        this.productName.setValue(mud.productName);
        this.productName.setValidators([Validators.required]);

        this.size.setValue(mud.size);
        this.size.setValidators([Validators.required]);

        this.toxicity.setValue(mud.toxicity);
        this.toxicity.setValidators([Validators.required]);

        setTimeout(() => {
            this.locations.setValue(mud.locations);
        }, );

    }

}