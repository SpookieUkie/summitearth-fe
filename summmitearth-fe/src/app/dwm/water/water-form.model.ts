import { FormControl, Validators, FormArray } from '@angular/forms';

export class WaterFormModel {
    _id = new FormControl(null, {
      updateOn: 'blur',
    });
    jobId =  new FormControl(null, {
      updateOn: 'blur',
    });
    waterNumber = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    waterOwnerId =  new FormControl(null, {
        updateOn: 'blur',
      });
    waterOwnerName = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    waterOwnerPhone =  new FormControl(null, {
        updateOn: 'blur',
    });


    waterLocation = new FormControl(null, {
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

    waypointLat = new FormControl(null, {
        updateOn: 'blur'
    });

    waypointLng = new FormControl(null, {
        updateOn: 'blur'
    });

    isTDLRequired = new FormControl(null, {
        updateOn: 'blur'
    });

   


    pH = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    ec = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    cl = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    so4 = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    mg = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    na = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    ca = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    sar = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    n = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    sg = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
a

    //Permit Info
    permitNumber = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    diversionPoint = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    purposeOfWaterDiversion = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    sourceOfWater= new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    sourceType = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    pointOfDiversion = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    pointOfUse  = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    maxRateOfDiversion = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    maxVolumeAllowed = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    maxDropdown = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    licenseEffectiveDate = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    licenseExpiryDate = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

}