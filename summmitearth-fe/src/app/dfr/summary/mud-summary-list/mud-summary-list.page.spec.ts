import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MudSummaryListPage } from './mud-summary-list.page';

describe('MudSummaryListPage', () => {
  let component: MudSummaryListPage;
  let fixture: ComponentFixture<MudSummaryListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MudSummaryListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MudSummaryListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
