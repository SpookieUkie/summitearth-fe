import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewjobComponent } from './newjob.component';

describe('NewjobComponent', () => {
  let component: NewjobComponent;
  let fixture: ComponentFixture<NewjobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewjobComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
