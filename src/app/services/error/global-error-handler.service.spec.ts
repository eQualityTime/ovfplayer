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
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { GlobalErrorHandlerService } from './global-error-handler.service';
import { FatalOpenVoiceFactoryError, OpenVoiceFactoryError } from 'src/app/errors';
import { ErrorService } from './error.service';
import { Router, RouterModule } from '@angular/router';
import { ErrorPageComponent } from 'src/app/error-page/error-page.component';
import { Location } from '@angular/common';

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;
  let errSer: ErrorService;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [GlobalErrorHandlerService, ErrorService],
    imports: [RouterModule.forRoot([{ path: 'error', component: ErrorPageComponent }]), ErrorPageComponent]
});

    router = TestBed.inject(Router);
    errSer = TestBed.inject(ErrorService);
    service = TestBed.inject(GlobalErrorHandlerService);
    location = TestBed.inject(Location);
    router.initialNavigation();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store non fatal errors without going to error page', fakeAsync(() => {
    try {
      throw new OpenVoiceFactoryError(1, "non fatal");
    }
    catch (e) {
      const path = location.path();
      service.handleError(e);
      expect(errSer.lastError.message).toBe("non fatal");
      tick();
      expect(router.navigated).toBeFalse();
      expect(location.path()).toBe(path);
    }
  }));

  it('should go to error page for fatal errors', fakeAsync(() => {
    try {
      throw new FatalOpenVoiceFactoryError(2, "fatal");
    }
    catch (e) {
      service.handleError(e);
      expect(errSer.lastError.message).toBe("fatal");
      tick();
      expect(router.navigated).toBeTrue();
      expect(location.path(false)).toBe("/error");
    }
  }));
});
