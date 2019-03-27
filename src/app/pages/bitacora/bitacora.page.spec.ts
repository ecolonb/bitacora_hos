import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BitacoraPage } from './bitacora.page';

describe('BitacoraPage', () => {
  let component: BitacoraPage;
  let fixture: ComponentFixture<BitacoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitacoraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitacoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
