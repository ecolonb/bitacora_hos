import { TestBed } from '@angular/core/testing';

import { AppConfiguracionService } from './app-configuracion.service';

describe('AppConfiguracionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppConfiguracionService = TestBed.get(AppConfiguracionService);
    expect(service).toBeTruthy();
  });
});
