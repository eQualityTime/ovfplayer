import { TestBed, inject } from '@angular/core/testing';

import { ConfigGuardService } from './config-guard.service';
import { ConfigService } from './config.service';
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
