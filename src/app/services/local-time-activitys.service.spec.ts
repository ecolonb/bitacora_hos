import { TestBed } from '@angular/core/testing';

import { LocalTimeActivitysService } from './local-time-activitys.service';

describe('LocalTimeActivitysService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalTimeActivitysService = TestBed.get(LocalTimeActivitysService);
    expect(service).toBeTruthy();
  });
});
