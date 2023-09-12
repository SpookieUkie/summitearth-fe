import { FormControl, Validators, FormArray } from '@angular/forms';

export class LandFormModel {
    _id = new FormControl(null, {
      updateOn: 'blur',
    });
    jobId =  new FormControl(null, {
      updateOn: 'blur',
    });
    landNumber = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    landOwnerId = new FormControl(null, {
        updateOn: 'blur',
    });
    landOwnerName = new FormControl(null, {
        updateOn: 'blur',
    });
    landOwnerPhone = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    landLoation = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    consentDate = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    agreementNumber = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    landUse = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    groundCondition = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    costOfLand = new FormControl(null, {
        updateOn: 'blur',
    });



   



}