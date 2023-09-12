import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfrRrrVegetationSummaryComponent } from './dfr-rrr-vegetation-summary.component';

describe('DfrRrrVegetationSummaryComponent', () => {
  let component: DfrRrrVegetationSummaryComponent;
  let fixture: ComponentFixture<DfrRrrVegetationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfrRrrVegetationSummaryComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfrRrrVegetationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
