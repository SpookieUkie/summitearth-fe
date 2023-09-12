import { FormControl, Validators, FormArray } from '@angular/forms';

export class SoilFormModel {
    _id = new FormControl(null, {
      updateOn: 'blur',
    });
    jobId =  new FormControl(null, {
      updateOn: 'blur',
    });
    landId = new FormControl(null, {
        updateOn: 'blur',
       
    });
    landLocation = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    sampleId = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    sampleDate = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    horizon = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    soilType = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    texture = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    horizonDepth = new FormControl(null, {
        updateOn: 'blur'
    });


    soilDensity = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
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

    totalHardness = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    ca = new FormControl(null, {
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

    sar = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    n = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    k = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    so = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    soilCategory = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    southofNE = new FormControl(null, {
        updateOn: 'blur',
        //validators: [Validators.required],
    });
    westofNE = new FormControl(null, {
        updateOn: 'blur',
        //validators: [Validators.required],
    });
    latitude = new FormControl(null, {
        updateOn: 'blur',
        //validators: [Validators.required],
    });
    longitude = new FormControl(null, {
        updateOn: 'blur',
        //validators: [Validators.required],
    });
}