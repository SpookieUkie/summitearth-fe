import { FormControl, Validators, FormArray } from '@angular/forms';

export class GeneralFormModel {
    _id = new FormControl(null, {
      updateOn: 'blur',
    });
    samplingCompany =  new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required],
    });
    companyContactName = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    tech1Name = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    tech1Id = new FormControl(null, {
        updateOn: 'blur',
    });
    tech2Name = new FormControl(null, {
        updateOn: 'blur',
    }); 
    tech2Id = new FormControl(null, {
        updateOn: 'blur',
    })
    tech3Name = new FormControl(null, {
        updateOn: 'blur',
    });
    tech3Id = new FormControl(null, {
        updateOn: 'blur',
    })
    tech4Name = new FormControl(null, {
        updateOn: 'blur',
    });
    tech4Id = new FormControl(null, {
        updateOn: 'blur',
    })
    qaqcLocation = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    postSamplingRequired = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    multiWellDisposal = new FormControl(null, {
        updateOn: 'blur',
        //validators: [Validators.required],
    });

    licensee = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    licenseNumber = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    wellName = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    drillingLocation = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    mslogc = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    uniqueWellId = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    surfaceLocation = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    drillingRig = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    spudDate = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    releaseDate = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });


    regOffice1Name = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    regOffice2Name = new FormControl(null, {
        updateOn: 'blur',
    });
    licenseeContactName = new FormControl(null, {
        updateOn: 'blur',
    });

    // Other
    complianceAdminName = new FormControl(null, {
        updateOn: 'blur',
    });

   



}