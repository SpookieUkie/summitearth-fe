import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective, FormGroupName } from '@angular/forms';

@Component({
  selector: 'app-textinput',
  templateUrl: './textinput.component.html',
  styleUrls: ['./textinput.component.scss'],
  viewProviders: [
    {
        provide: ControlContainer,
        useExisting: FormGroupDirective
    }]
})
export class TextinputComponent implements OnInit {
  @Input() sectionTitle: string;
  @Input() fieldName: string;
  @Input() inlineFormGroup: FormGroup;
  @Input() inlineFormGroupName: FormGroupName;
  @Input() isMobileDevice: boolean;

  constructor() { }

  ngOnInit() {}

}
