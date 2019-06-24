import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgHomePage } from './pg-home.page';

describe('PgHomePage', () => {
  let component: PgHomePage;
  let fixture: ComponentFixture<PgHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
