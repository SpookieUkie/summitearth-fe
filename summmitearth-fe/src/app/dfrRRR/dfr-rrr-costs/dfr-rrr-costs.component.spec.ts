import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfrRrrCostsComponent } from './dfr-rrr-costs.component';

describe('DfrRrrCostsComponent', () => {
  let component: DfrRrrCostsComponent;
  let fixture: ComponentFixture<DfrRrrCostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfrRrrCostsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfrRrrCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
