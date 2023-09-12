import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechpickerComponent } from './techpicker.component';

describe('TechpickerComponent', () => {
  let component: TechpickerComponent;
  let fixture: ComponentFixture<TechpickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechpickerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
