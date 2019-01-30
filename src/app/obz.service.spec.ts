/* ::START::LICENCE::
Copyright eQualityTime ©2018
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
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OBZFixture } from '../test-utils/OBZFixture';
import { ObzService } from './obz.service';
import { ErrorCodes } from './errors';
import { BoardCacheService } from './board-cache.service';
import { of, throwError } from 'rxjs';
import { OBZBoardSet } from './obzboard-set';

describe('ObzService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ObzService, BoardCacheService]
    });
  });

  it('should be created', inject([ObzService], (service: ObzService) => {
    expect(service).toBeTruthy();
  }));

  it('getBoardSet should throw fatal error if unable to load file', (done) => {
    inject(
      [ObzService, HttpTestingController, BoardCacheService],
      (service: ObzService, httpMock: HttpTestingController, cache: BoardCacheService) => {

      spyOn(cache, 'retrieve').and.returnValue(throwError(new Error('Cache is empty')));

      service.getBoardSet().subscribe({
        next() { console.log('Hmmm'); },
        error(err) {
          expect(err.errorCode).toBe(ErrorCodes.OBZ_DOWNLOAD_ERROR);
          done();
        }
      });
      const request = httpMock.expectOne('https://dl.dropboxusercontent.com/s/oiwfo47fprv3jl4/ck20.obz?dl=1');
      request.error(new ErrorEvent('ERROR_LOADING_OBZ'));
      httpMock.verify();
    })();
  });

  it('getBoardSet should return cache hit', (done) => {
    inject(
      [ObzService, HttpTestingController, BoardCacheService],
      (service: ObzService, httpMock: HttpTestingController, cache: BoardCacheService) => {

      const boardSet = new OBZBoardSet();
      boardSet.rootBoardKey = 'test';

      spyOn(cache, 'retrieve').and.returnValue(of(boardSet));

      service.getBoardSet().subscribe({
        next(value) {
          expect(value).toBe(boardSet);
          done();
        },
      });
    })();
  });

  it('parseOBZFile should throw error if no manifest', (done) => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('nomanifest');
      service.parseOBZFile(blob).subscribe({
        next: () => {},
        error: (reason) => {
          expect(reason.errorCode).toBe(ErrorCodes.MISSING_MANIFEST);
          done();
        }
      });
    })();
  });

  it('parseOBZFile should throw error if binary manifest', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('dodgymanifest');
      service.parseOBZFile(blob).subscribe({
        next: () => { },
        error: (reason) => {
          expect(reason.errorCode).toBe(ErrorCodes.MANIFEST_JSON_ERROR);
          done();
        }
      });
    })();
  });

  it('parseOBZFile should throw error if specified board is not there', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('noboard');
      service.parseOBZFile(blob).subscribe({
        next: () => { },
        error: (reason) => {
          expect(reason.errorCode).toBe(ErrorCodes.BOARD_NOT_THERE);
          done();
        }
      });
    })();
  });

  it('parseOBZFile should throw error if specified board is not JSON', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('dodgyboard');
      service.parseOBZFile(blob).subscribe({
        next: () => { },
        error: (reason) => {
          expect(reason.errorCode).toBe(ErrorCodes.BOARD_PARSE_ERROR);
          done();
        }
      });
    })();
  });

  it('parseOBZFile should throw error if image is not in obz', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('missingimage');
      service.parseOBZFile(blob).subscribe({
        next: () => { },
        error: (reason) => {
          expect(reason.errorCode).toBe(ErrorCodes.IMAGE_NOT_THERE);
          done();
        }
      });
    })();
  });

  it('parseOBZFile should throw error if sound is not in obz', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('missingsound');
      service.parseOBZFile(blob).subscribe({
        next: () => { },
        error: (reason) => {
          expect(reason.errorCode).toBe(ErrorCodes.SOUND_NOT_THERE);
          done();
        }
      });
    })();
  });

  it('parseOBZFile should throw error if invalid root', (done) => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('invalidroot');
      // test parseOBZFile
      const promise = service.parseOBZFile(blob);
      promise.then(function () {
        // just don't call done and test will fail with timeout...
      }, function (reason) {
        expect(reason.errorCode).toBe(ErrorCodes.INVALID_ROOT);
        done();
      });
    })();
  });
});
