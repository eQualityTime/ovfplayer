/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020
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
import { LocalStorage } from '@ngx-pwa/local-storage';
import { of } from 'rxjs';
import { OBZBoardSet } from '../../obzboard-set';

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
    inject([BoardCacheService, LocalStorage], (service: BoardCacheService, localStorage: LocalStorage) => {
      spyOn(localStorage, 'removeItem').and.returnValue(of(true));
      service.clear();
      expect(localStorage.removeItem).toHaveBeenCalled();
    })
  );

  it('should call setItem when save', (done) => {
    inject([BoardCacheService, LocalStorage], (service: BoardCacheService, localStorage: LocalStorage) => {
      spyOn(localStorage, 'setItem').and.returnValue(of(true));
      const boardSet = new OBZBoardSet();
      service.save(boardSet).subscribe(ret => {
        expect(ret).toBe(boardSet);
        done();
      });
      expect(localStorage.setItem).toHaveBeenCalled();
    })();
  });

  it('should call getItem when retrieve', (done) => {
    inject([BoardCacheService, LocalStorage], (service: BoardCacheService, localStorage: LocalStorage) => {
      const boardSet = {
        rootBoardKey: 'testRoot',
        images: [],
        sounds: [],
        boards: []
      };
      spyOn(localStorage, 'getItem').and.returnValue(of(boardSet));
      service.retrieve().subscribe(ret => {
        expect(ret.rootBoardKey).toBe('testRoot');
        done();
      });
      expect(localStorage.getItem).toHaveBeenCalled();
    })();
  });

  it('should throw error when cache is empty', (done) => {
    inject([BoardCacheService, LocalStorage], (service: BoardCacheService, localStorage: LocalStorage) => {
      spyOn(localStorage, 'getItem').and.returnValue(of(null));
      service.retrieve().subscribe({
        next: () => {},
        error: (err) => {
          expect(err).toBeTruthy();
          done();
        }
      });
      expect(localStorage.getItem).toHaveBeenCalled();
    })();
  });
});
