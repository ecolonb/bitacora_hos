import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleItemBitacoraPage } from './detalle-item-bitacora.page';

describe('DetalleItemBitacoraPage', () => {
  let component: DetalleItemBitacoraPage;
  let fixture: ComponentFixture<DetalleItemBitacoraPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleItemBitacoraPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleItemBitacoraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
