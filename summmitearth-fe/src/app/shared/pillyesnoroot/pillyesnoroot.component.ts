import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormGroupName, ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-pillyesnoroot',
  templateUrl: './pillyesnoroot.component.html',
  styleUrls: ['./pillyesnoroot.component.scss'],
  viewProviders: [
    {
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
  
})
export class PillYesNoRootComponent implements OnInit {
  @Input() sectionTitle: string;
  @Input() fieldName: string;
  @Input() inlineFormGroup: FormGroup;
  //@Input() inlineFormGroupName: FormGroupName;
  @Input() isMobileDevice: boolean;

  constructor() {

  }

  ngOnInit() {
    console.log (this.fieldName);
  }

}
