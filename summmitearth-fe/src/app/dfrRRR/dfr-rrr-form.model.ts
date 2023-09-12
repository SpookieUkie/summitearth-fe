import { FormControl, Validators, FormArray } from '@angular/forms';

export class DfrRRRFormModel {
    _id = new FormControl(null, {
      updateOn: 'blur',
    });
    client =  new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required],
    });
    jobType = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    projectNumber = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    projectType = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    lsd = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    landType = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    dispositions = new FormControl(null, {
        updateOn: 'blur',
    });
    dfrDate = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    dfrStatus = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    isSummitTech = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    fieldTechName = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    fieldTechLicense = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    projectSupervisor = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    landownerName = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    landownerPhoneNumber = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    landUse = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    typography = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    wellsitePadded = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    onsiteVegitation = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });
    
    weatherTemperature = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    weatherConditions = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    groundConditions  = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
    });

    //Vegetation Only
    windSpped = new FormControl(null, {
        updateOn: 'blur',
    });
    windDirection = new FormControl(null, {
        updateOn: 'blur',
    });
    herbicideType = new FormControl(null, {
        updateOn: 'blur',
    });
    herbicideSprayRate = new FormControl(null, {
        updateOn: 'blur',
    });
    herbicideSprayUnits  = new FormControl(null, {
        updateOn: 'blur',
    });

    dailySummary = new FormControl(null, {
        updateOn: 'blur',
    });

    nextPlannedAction = new FormControl(null, {
        updateOn: 'blur',
    });

    // May Take out and add manually
    costs = new FormControl(null, {
        updateOn: 'blur',
    });



}