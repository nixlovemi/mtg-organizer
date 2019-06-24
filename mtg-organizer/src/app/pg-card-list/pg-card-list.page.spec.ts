import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgCardListPage } from './pg-card-list.page';

describe('PgCardListPage', () => {
  let component: PgCardListPage;
  let fixture: ComponentFixture<PgCardListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgCardListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgCardListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
