import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors,
  NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, } from '@angular/forms';

@Component({
  selector: 'app-daily-salinity',
  templateUrl: './daily-salinity.component.html',
  styleUrls: ['./daily-salinity.component.scss'],
  providers: [
    {
   provide: NG_VALUE_ACCESSOR,
   useExisting: forwardRef(() => DailySalinityComponent),
   multi: true
 },
  {
   provide: NG_VALIDATORS,
   useExisting: forwardRef(() => DailySalinityComponent),
   multi: true
 }]
})
export class DailySalinityComponent implements OnInit, ControlValueAccessor, Validator {
//export class DailySalinityComponent implements OnInit  {
  @Input() salinity: FormGroup;
  @Input() index;

  form: FormGroup;
  constructor() { }
  
  ngOnInit() {
    console.log ('this.salinity');
    console.log (this.salinity);
    this.form = new FormGroup({
      _id: new FormControl(null, {
        updateOn: 'blur',
      }), 
    pH: new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.min(0)]
    }),
    Ca: new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.min(0)]
    }),
    EC: new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.min(0)]
    }),
    Mg: new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.min(0)]
    }),
    Na: new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.min(0)]
    }),
    N: new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.min(0)]
    }),
    S: new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.min(0)]
    }),
    Cl: new FormControl(null, {
      updateOn: 'blur',
      validators: [Validators.min(0)]
    }),
    waterBodyCrossing: new FormControl(null, {
      updateOn: 'blur',
    }),
    dailyNTU: new FormControl(null, {
      updateOn: 'blur',
    })
  });
    this.setFormData();
  }

  setFormData() {
    
    for (const i in this.form.controls) {
      if (i !== '_id') {
        if (this.salinity.value[i] !== undefined) {
          this.form.get(i).setValue(this.salinity.value[i]);
        } else {
          this.form.get(i).patchValue(null);
        }
      }
    }
  }

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    console.log("write value");
    val && this.form.setValue(val, { emitEvent: false });
  }
  registerOnChange(fn: any): void {
    console.log("on change");
    this.form.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    console.log("on blur");
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null{
    console.log("Basic Info validation", c);
    return this.form.valid ? null : { invalidForm: {valid: false, message: "Salinities Form Not Valid"}};
  }


  removeSalinitiy() {
    
  }

}
