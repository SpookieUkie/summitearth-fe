import { FormControl, Validators } from '@angular/forms';

export class GenericFileFormModel {
    genericId =  new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    genericIdType = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    genericSubId = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    genericSubIdType = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    fileComments = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    displayName = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    fileName = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    originalFileName = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    mimeType = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    fileSize = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    fileUrl = new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.required]
    });
    file = new FormControl(null, {
      updateOn: 'blur'
    });
    _id = new FormControl(null, {});

}