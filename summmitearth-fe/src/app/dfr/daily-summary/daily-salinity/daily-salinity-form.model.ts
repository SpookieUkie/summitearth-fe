import { FormControl, Validators } from '@angular/forms';
import { DfrDailySalinityModel } from './daily-salinity.model';

export class DfrDailySalinityFormModel {
        _id = new FormControl();
        name = new FormControl();
    // Field Test Results
        pH = new FormControl();
        Ca = new FormControl();
        EC = new FormControl();
        Mg = new FormControl();
        Na = new FormControl();
        N = new FormControl();
        S = new FormControl();
        Cl = new FormControl();
        waterBodyCrossing = new FormControl();
        dailyNTU? = new FormControl();

    constructor(sal: DfrDailySalinityModel){
        this._id.setValue(sal._id);

        Object.keys(sal).forEach(key => {
            this[key].setValue(sal[key]);
            if (key !== '_id') {
                this[key].setValidators([Validators.required]);
            }
            // form.get(key).markAsTouched();

         });

        //this.name.setValue(sal.name);

    }
}
