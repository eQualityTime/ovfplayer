import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
});
