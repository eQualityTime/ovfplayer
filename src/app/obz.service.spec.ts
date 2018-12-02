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

  it('should load a fixture', function () {
    const fixtures = window['__obz__'];
    const noManifest = fixtures['nomanifest'];
    const contents = JSON.parse(noManifest);
    expect(contents.name).toBe('Simon');
  });
});
