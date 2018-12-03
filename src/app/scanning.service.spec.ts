import { TestBed, inject } from '@angular/core/testing';

import { ScanningService } from './scanning.service';

describe('ScanningService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScanningService]
    });
  });

  it('should be created', inject([ScanningService], (service: ScanningService) => {
    expect(service).toBeTruthy();
  }));
});
