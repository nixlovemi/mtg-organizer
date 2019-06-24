import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgDecksPage } from './pg-decks.page';

describe('PgDecksPage', () => {
  let component: PgDecksPage;
  let fixture: ComponentFixture<PgDecksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgDecksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgDecksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
