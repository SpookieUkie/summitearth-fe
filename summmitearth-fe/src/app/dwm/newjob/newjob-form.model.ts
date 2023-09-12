import { FormControl, Validators, FormArray } from '@angular/forms';

export class NewJobFormModel {
    _id = new FormControl(null, {
      updateOn: 'blur',
    });
    jobCategory =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    jobType =  new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    provinceStateCountry=  new FormControl(null, {
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

    licensee = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    licenseNumber = new FormControl(null, {
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

    spudDate = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });


    licenseeContactName = new FormControl(null, {
        updateOn: 'blur',
    });

    // Other
    complianceAdminName = new FormControl(null, {
        updateOn: 'blur',
    });

   



}