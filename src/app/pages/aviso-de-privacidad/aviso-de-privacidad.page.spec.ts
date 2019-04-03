import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoDePrivacidadPage } from './aviso-de-privacidad.page';

describe('AvisoDePrivacidadPage', () => {
  let component: AvisoDePrivacidadPage;
  let fixture: ComponentFixture<AvisoDePrivacidadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisoDePrivacidadPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisoDePrivacidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
