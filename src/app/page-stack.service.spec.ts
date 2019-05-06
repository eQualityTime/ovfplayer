import { TestBed, inject } from '@angular/core/testing';

import { PageStackService } from './page-stack.service';

describe('PageStackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageStackService]
    });
  });

  it('should be created', inject([PageStackService], (service: PageStackService) => {
    expect(service).toBeTruthy();
  }));
});
