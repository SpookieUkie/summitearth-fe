import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwmPage } from './dwm.page';

describe('DwmPage', () => {
  let component: DwmPage;
  let fixture: ComponentFixture<DwmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
