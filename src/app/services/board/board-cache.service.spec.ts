/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020, ©2021, ©2022, ©2023, ©2024, ©2025
This file is part of OVFPlayer.
OVFPlayer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
OVFPlayer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with OVFPlayer.  If not, see <https://www.gnu.org/licenses/>.
::END::LICENCE:: */
import { TestBed, inject } from '@angular/core/testing';
import { BoardCacheService } from './board-cache.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { of } from 'rxjs';
import { OBZBoardSet } from '../../obzboard-set';
import { OBFBoard } from 'src/app/obfboard';

describe('BoardCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ BoardCacheService ]
    });
  });

  it('should be created', inject([BoardCacheService], (service: BoardCacheService) => {
    expect(service).toBeTruthy();
  }));

  it(
    'should call removeItem when clear',
    inject([BoardCacheService, StorageMap], (service: BoardCacheService, localStorage: StorageMap) => {
      spyOn(localStorage, 'delete').and.returnValue(of(undefined));
      service.clear();
      expect(localStorage.delete).toHaveBeenCalled();
    })
  );

  it('should call setItem when save', (done) => {
    inject([BoardCacheService, StorageMap], (service: BoardCacheService, localStorage: StorageMap) => {
      spyOn(localStorage, 'set').and.returnValue(of(undefined));
      const boardSet = new OBZBoardSet();
      service.save(boardSet).subscribe(ret => {
        expect(ret).toBe(boardSet);
        done();
      });
      expect(localStorage.set).toHaveBeenCalled();
    })();
  });

  it('should call getItem when retrieve', (done) => {
    inject([BoardCacheService, StorageMap], (service: BoardCacheService, localStorage: StorageMap) => {
      const boardSet = {
        rootBoardKey: 'testRoot',
        images: [],
        sounds: [],
        boards: []
      };
      spyOn(localStorage, 'get').and.returnValue(of(boardSet));
      service.retrieve().subscribe(ret => {
        expect(ret.rootBoardKey).toBe('testRoot');
        done();
      });
      expect(localStorage.get).toHaveBeenCalled();
    })();
  });

  it('should throw error when cache is empty', (done) => {
    inject([BoardCacheService, StorageMap], (service: BoardCacheService, localStorage: StorageMap) => {
      spyOn(localStorage, 'get').and.returnValue(of(null));
      service.retrieve().subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeTruthy();
          done();
        }
      });
      expect(localStorage.get).toHaveBeenCalled();
    })();
  });

  it('should be able to put a board into the cache and get it back out again', (done) => {
    
    inject([BoardCacheService], (service: BoardCacheService) => {
      spyOn(service, 'getCacheKey').and.returnValue('cache_test_only');

      const boardSet = new OBZBoardSet();
      boardSet.rootBoardKey = undefined;
      const testBoardJSON = {
        format: 'board_format',
        id: 5,
        locale: 'en_GB',
        name: 'board_name',
        description_html: '<b>desc</b>',
        grid: {
          rows: 2,
          columns: 2,
          order: [[1, null],
          [null, 2]]
        },
        buttons: [
          {
            id: 1,
            label: 'button1'
          },
          {
            id: 2,
            label: 'button2'
          }
        ],
        images: [
          {
            id: 1,
            url: 'http://example.com'
          }
        ],
        sounds: [
          {
            id: 1,
            url: 'http://another.com'
          }
        ]
      };
      const testBoard = new OBFBoard().deserialize(testBoardJSON);
      boardSet.setBoard('test', testBoard);
      
      // does this want to fail? or just warn?
      // Failure means the test can never get cleaned up because we don't then run the delete
      // Warning means the test can never end up deleting real data that has a key clash (may be irrelevant due to domain scoping?)
      service.retrieve().subscribe({next: () => { done.fail('Cache contains "test" item before test') }, error: () => {
        const cleanup = (callback: () => void) => {
          service.clear().subscribe({next: () => {
            service.retrieve().subscribe({next: () => { done.fail('Cache contains "test" item after test') }, error: () => { callback(); }});
          }, error: done.fail});
        };

        service.save(boardSet).subscribe({next: (ret) => {
          expect(ret).toBe(boardSet);
          service.retrieve().subscribe({next: (ret) => {
            expect(ret).toEqual(boardSet);
            cleanup(done);
          }, error: (err) => { cleanup(() => { done.fail(err); }); }});
        }, error: (err) => { cleanup(() => { done.fail(err); }); } });
        }});
    })();
  });
});
