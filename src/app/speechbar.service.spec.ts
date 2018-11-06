import { TestBed, inject } from '@angular/core/testing';

import { SpeechbarService } from './speechbar.service';

describe('SpeechbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeechbarService]
    });
  });

  it('should be created', inject([SpeechbarService], (service: SpeechbarService) => {
    expect(service).toBeTruthy();
  }));
});
