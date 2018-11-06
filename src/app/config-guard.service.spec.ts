import { TestBed, inject } from '@angular/core/testing';

import { ConfigGuardService } from './config-guard.service';

describe('ConfigGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigGuardService]
    });
  });

  it('should be created', inject([ConfigGuardService], (service: ConfigGuardService) => {
    expect(service).toBeTruthy();
  }));
});
