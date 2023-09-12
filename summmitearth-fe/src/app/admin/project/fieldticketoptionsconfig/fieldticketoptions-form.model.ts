import { FormControl, Validators } from '@angular/forms';
import { FieldTicketOptionsModel } from '../../fieldticketoptions/fieldticketoptions.model';

export class FieldTicketOptionsFormModel {
        _id = new FormControl();
        chargeLabel = new FormControl();
        unitType = new FormControl();
        defaultQty = new FormControl();
        clientCost = new FormControl();
        qtyIncluded = new FormControl();
        equipmentCost = new FormControl();
        percentMarkup = new FormControl();
        showByDefault = new FormControl();
        linkedToTech = new FormControl();
        group = new FormControl();
        section = new FormControl();
        isActive = new FormControl();


        constructor(val: FieldTicketOptionsModel) {
            this.isActive.setValue(val._id);
            Object.keys(val).forEach(key => {
                if (key !== undefined && val[key] !== undefined && key !== 'updatedAt') {
                    this[key].setValue(val[key]);
                    if (key !== '_id') {
                        //this[key].setValidators([Validators.required]);
                    }
                 }
             });
        }
}