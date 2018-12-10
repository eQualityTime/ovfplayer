import { TestBed, inject } from '@angular/core/testing';

import { ErrorService } from './error.service';

describe('ErrorServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorService]
    });
  });

  it('should be created', inject([ErrorService], (service: ErrorService) => {
    expect(service).toBeTruthy();
  }));
});
