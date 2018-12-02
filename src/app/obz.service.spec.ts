import { TestBed, inject, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ObzService } from './obz.service';

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

      // TODO: extract to useful method
      // ------------------------------
      // pull fixture
      const fixtures = window['__obz__'];
      const noManifest = fixtures['nomanifest'];
      const contents = JSON.parse(noManifest);

      console.log(`Data ${contents.data}`);
      // convert base64 fixture data to blob
      const byteCharacters = atob(contents.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/octet-stream' });
      // ------------------------------

      // test parseOBZFile
      const promise = service.parseOBZFile(blob);
      promise.then(function () {
        // just don't call done and test will fail with timeout...
        // throw new Error('Manifest error should have been thrown');
      }, function (reason) {
        console.log(reason);
        let t = reason.cause;
        while (t) {
          console.log(t);
          t = t.cause;
        }
        // TODO: actually test for correct reason
        // TODO: add error codes to exceptions!
        done();
      });
    })();
  });
});
