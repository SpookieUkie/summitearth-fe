import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PillyesnoComponent } from './pillyesno.component';

describe('PillyesnoComponent', () => {
  let component: PillyesnoComponent;
  let fixture: ComponentFixture<PillyesnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PillyesnoComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PillyesnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
