import { TestBed, inject } from '@angular/core/testing';

import { BoardService } from './board.service';
import { ObzService } from './obz.service';

describe('BoardService', () => {
  let obzServiceStub: Partial<ObzService>;

  beforeEach(() => {
    obzServiceStub = {};

    TestBed.configureTestingModule({
      providers: [
        BoardService,
        {provide: ObzService, useValue: obzServiceStub}
      ]
    });
  });

  it('should be created', inject([BoardService], (service: BoardService) => {
    expect(service).toBeTruthy();
  }));
});
