import { TestBed } from '@angular/core/testing';

import { SyncUpService } from './sync-up.service';

describe('SyncUpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SyncUpService = TestBed.get(SyncUpService);
    expect(service).toBeTruthy();
  });
});
