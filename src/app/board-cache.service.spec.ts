/* ::START::LICENCE:: ::END::LICENCE:: */
import { TestBed, inject } from '@angular/core/testing';

import { BoardCacheService } from './board-cache.service';

describe('BoardCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardCacheService]
    });
  });

  it('should be created', inject([BoardCacheService], (service: BoardCacheService) => {
    expect(service).toBeTruthy();
  }));
});
