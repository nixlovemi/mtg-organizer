import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgSetListPage } from './pg-set-list.page';

describe('PgSetListPage', () => {
  let component: PgSetListPage;
  let fixture: ComponentFixture<PgSetListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PgSetListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgSetListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
