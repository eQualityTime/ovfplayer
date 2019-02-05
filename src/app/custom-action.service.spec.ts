import { TestBed, inject } from '@angular/core/testing';

import { CustomActionService } from './custom-action.service';

describe('CustomActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomActionService]
    });
  });

  it('should be created', inject([CustomActionService], (service: CustomActionService) => {
    expect(service).toBeTruthy();
  }));
});
