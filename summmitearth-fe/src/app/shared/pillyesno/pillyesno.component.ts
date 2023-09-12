import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormGroupName, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-pillyesno',
  templateUrl: './pillyesno.component.html',
  styleUrls: ['./pillyesno.component.scss'],
  viewProviders: [
    {
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
  
})
export class PillYesNoComponent implements OnInit {
  @Input() sectionTitle: string;
  @Input() fieldName: string;
  @Input() inlineFormGroup: FormGroup;
  @Input() inlineFormGroupName: FormGroupName;
  @Input() isMobileDevice: boolean;

  constructor() {

  }

  ngOnInit() {
    console.log (this.fieldName);
  }

}
