import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgDeckHomePage } from './pg-deck-home.page';

describe('PgDeckHomePage', () => {
  let component: PgDeckHomePage;
  let fixture: ComponentFixture<PgDeckHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgDeckHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgDeckHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
