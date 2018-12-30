import { TestBed, inject } from '@angular/core/testing';

import { ProgressService, ProgressObject } from './progress.service';

describe('ProgressService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgressService]
    });
  });

  it('should be created', inject([ProgressService], (service: ProgressService) => {
    expect(service).toBeTruthy();
  }));

  it('progress should be reported', (done) => {
    inject([ProgressService], (service: ProgressService) => {

      const input = ProgressService.message('Hello');

      service.getProgress().subscribe({
        next(progress: ProgressObject) {
          expect(progress).toBe(input);
          done();
        }
      });

      service.progress(input);
    })();
  });
});
