import { FormControl, Validators, FormArray } from '@angular/forms';
import { DailyAuditDwmModel } from './dailyauditdwm.model';
import { DailyAuditDwmSprayfieldModel } from './dailyauditdwmsprayfield.model';


export class DailyAuditDWMSprayfieldFormModel {
  _id = new FormControl(null, {
    updateOn: 'blur',
  });
   sprayfieldLocation = new FormControl(null, {
    updateOn: 'blur',
    validators: [Validators.required],
  });
  sprayfieldPylons = new FormControl(null, {
    updateOn: 'blur',
    validators: [Validators.required],
  });
  sprayfieldWaterBodyIdentification = new FormControl(null, {
    updateOn: 'blur',
    validators: [Validators.required],
  });
  sprayfieldPooling = new FormControl(null, {
    updateOn: 'blur',
    validators: [Validators.required],
  });
  sprayfieldShalePiles = new FormControl(null, {
    updateOn: 'blur',
    validators: [Validators.required],
  });
  sprayfieldOutsidePylons = new FormControl(null, {
    updateOn: 'blur',
    validators: [Validators.required],
  });
  sprayfieldOverlap = new FormControl(null, {
    updateOn: 'blur',
    validators: [Validators.required],
  });
  sprayfieldSprayrate = new FormControl(null, {
    updateOn: 'blur',
    validators: [Validators.required],
  });
  sprayfieldFieldUse = new FormControl(null, {
    updateOn: 'blur',
    validators: [Validators.required],
  });
}