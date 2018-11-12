import { TestBed, inject } from '@angular/core/testing';

import { ObzService } from './obz.service';

describe('ObzService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObzService]
    });
  });

  it('should be created', inject([ObzService], (service: ObzService) => {
    expect(service).toBeTruthy();
  }));
});
