import { TestBed } from '@angular/core/testing';

import { UnidadService } from './unidad.service';

describe('UnidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UnidadService = TestBed.get(UnidadService);
    expect(service).toBeTruthy();
  });
});
