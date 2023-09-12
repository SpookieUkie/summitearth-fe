import { FormControl, Validators, FormArray } from '@angular/forms';



export class GenericPhotoFormModel {
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
      photoComments = new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      });
      image = new FormControl(null, {
        updateOn: 'blur'
      });
      useGeoRef = new FormControl(null, {
        updateOn: 'blur'
      });
      additionalGeoRefComments =  new FormControl(null, {
        updateOn: 'blur'
      });
      photoType = new FormControl(null, {
        updateOn: 'blur'
      });
      mimeType = new FormControl(null, {
        updateOn: 'blur'
      });
      originalFileName = new FormControl(null, {
        updateOn: 'blur'
      });
      fileName = new FormControl(null, {
        updateOn: 'blur'
      });
      fileSize = new FormControl(null, {
        updateOn: 'blur'
      });

}