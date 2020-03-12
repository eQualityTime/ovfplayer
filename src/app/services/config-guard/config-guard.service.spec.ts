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

import { ConfigGuardService } from './config-guard.service';
import { ConfigService } from '../config/config.service';
import { Router } from '@angular/router';

describe('ConfigGuardService', () => {
  let routerStub: Partial<Router>;
  let configServiceStub: Partial<ConfigService>;

  beforeEach(() => {
    routerStub = {};
    configServiceStub = {};

    TestBed.configureTestingModule({
      providers: [
        ConfigGuardService,
        {provide: Router, useValue: routerStub},
        {provide: ConfigService, useValue: configServiceStub}
      ]
    });
  });

  it('should be created', inject([ConfigGuardService], (service: ConfigGuardService) => {
    expect(service).toBeTruthy();
  }));
});
