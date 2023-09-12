import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DfrTechlistPage } from './dfr-techlist.page';

describe('DfrTechlistPage', () => {
  let component: DfrTechlistPage;
  let fixture: ComponentFixture<DfrTechlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DfrTechlistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DfrTechlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
