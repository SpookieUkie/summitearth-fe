import { DfrDailySalinityModel } from '../daily-salinity/daily-salinity.model';
import { FormControl, Validators } from '@angular/forms';
import { DfrDailyDisposalModel } from './daily-disposal.model';

export class DfrDailyDisposalFormModel {
    public _id = new FormControl();
    public disposalArea = new FormControl();
    public disposalMethod = new FormControl();
    public dailyVolume = new FormControl();

    constructor(disposal: DfrDailyDisposalModel) {

        this._id.setValue(disposal._id);

        this.dailyVolume.setValue(disposal.dailyVolume);
        this.dailyVolume.setValidators([Validators.required]);

        this.disposalArea.setValue(disposal.disposalArea);
        this.disposalArea.setValidators([Validators.required]);

        // Hack for drop down values
        setTimeout(() => {
            this.disposalMethod.setValue(disposal.disposalMethod);
            this.disposalMethod.setValidators([Validators.required]);
        }, 750);

    }
}
