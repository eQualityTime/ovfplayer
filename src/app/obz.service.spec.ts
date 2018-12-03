import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OBZFixture } from '../test-utils/OBZFixture';
import { ObzService } from './obz.service';
import { ErrorCodes } from './errors';

describe('ObzService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ObzService]
    });
  });

  it('should be created', inject([ObzService], (service: ObzService) => {
    expect(service).toBeTruthy();
  }));

  it('getBoardSet should throw fatal error if unable to load file', (done) => {
    inject([ObzService, HttpTestingController], (service: ObzService, httpMock: HttpTestingController) => {

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

  it('parseOBZFile should throw error if no manifest', (done) => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('nomanifest');
      // test parseOBZFile
      const promise = service.parseOBZFile(blob);
      promise.then(function () {
        // just don't call done and test will fail with timeout...
      }, function (reason) {
        expect(reason.errorCode).toBe(ErrorCodes.MISSING_MANIFEST);
        done();
      });
    })();
  });

  it('parseOBZFile should throw error if binary manifest', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('dodgymanifest');
      // test parseOBZFile
      const promise = service.parseOBZFile(blob);
      promise.then(function() {
          // just don't call done and test will fail with timeout...
        }, function(reason) {
          expect(reason.errorCode).toBe(ErrorCodes.MANIFEST_JSON_ERROR);
          done();
        });
    })();
  });

  it('parseOBZFile should throw error if specified board is not there', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('noboard');
      // test parseOBZFile
      const promise = service.parseOBZFile(blob);
      promise.then(function () {
        // just don't call done and test will fail with timeout...
      }, function (reason) {
        expect(reason.errorCode).toBe(ErrorCodes.BOARD_NOT_THERE);
        done();
      });
    })();
  });

  it('parseOBZFile should throw error if specified board is not JSON', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('dodgyboard');
      // test parseOBZFile
      const promise = service.parseOBZFile(blob);
      promise.then(function () {
        // just don't call done and test will fail with timeout...
      }, function (reason) {
        expect(reason.errorCode).toBe(ErrorCodes.BOARD_PARSE_ERROR);
        done();
      });
    })();
  });

  it('parseOBZFile should throw error if image is not in obz', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('missingimage');
      // test parseOBZFile
      const promise = service.parseOBZFile(blob);
      promise.then(function() {
          // just don't call done and test will fail with timeout...
        }, function(reason) {
          expect(reason.errorCode).toBe(ErrorCodes.IMAGE_NOT_THERE);
          done();
        });
    })();
  });

  it('parseOBZFile should throw error if sound is not in obz', done => {
    inject([ObzService], (service: ObzService) => {
      const blob = OBZFixture.load('missingsound');
      // test parseOBZFile
      const promise = service.parseOBZFile(blob);
      promise.then(function () {
        // just don't call done and test will fail with timeout...
      }, function (reason) {
        expect(reason.errorCode).toBe(ErrorCodes.SOUND_NOT_THERE);
        done();
      });
    })();
  });
});
