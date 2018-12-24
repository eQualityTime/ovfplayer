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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ConfigPageComponent } from './config-page.component';
import { ConfigService } from '../config.service';
import { MatFormFieldModule, MatCardModule, MatCheckboxModule, MatInputModule, MatSnackBar, MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment, Params, Data, Route, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Type } from '@angular/core';
import { OBFPageComponent } from '../obfpage/obfpage.component';

// we might not need this, the current tests can all be done with RouterTestingModule.withRoutes([])
export class MockActivatedRoute implements ActivatedRoute {
  snapshot: ActivatedRouteSnapshot;
  url: Observable<UrlSegment[]>;
  params: Observable<Params>;
  queryParams: Observable<Params>;
  fragment: Observable<string>;
  data: Observable<Data>;
  outlet: string;
  component: Type<any> | string;
  routeConfig: Route;
  root: ActivatedRoute;
  parent: ActivatedRoute;
  firstChild: ActivatedRoute;
  children: ActivatedRoute[];
  pathFromRoot: ActivatedRoute[];
  paramMap: Observable<ParamMap>;
  queryParamMap: Observable<ParamMap>;
  toString(): string {
    return '';
  }
}

describe('ConfigPageComponent', () => {
  let component: ConfigPageComponent;
  let fixture: ComponentFixture<ConfigPageComponent>;
  let configServiceStub: Partial<ConfigService>;
  let routerStub: Partial<Router>;
  let snackbarStub: Partial<MatSnackBar>;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(async(() => {
    routerStub = {};
    configServiceStub = {
      boardURL: '',
      showIconsInSpeechbar: false,
      displayedButtons: {
        showSpeakButton: false,
        showHomeButton: false,
        showBackspaceButton: false,
        showClearButton: false
      },
      scanningConfig: {
        enabled: false,
        time: 0
      }
    };
    snackbarStub = {};
    mockActivatedRoute = new MockActivatedRoute();
    mockActivatedRoute.snapshot = {
      url: null,
      params: null,
      queryParamMap: {
        has: (name) => false,
        get: (name) => null,
        getAll: () => null,
        keys: []
      },
      queryParams: null,
      fragment: null,
      data: null,
      outlet: null,
      component: null,
      routeConfig: null,
      root: null,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: null,
      paramMap: null
    };

    TestBed.configureTestingModule({
      declarations: [ ConfigPageComponent, OBFPageComponent ],
      providers: [
        {provide: Router, useValue: routerStub},
        {provide: ConfigService, useValue: configServiceStub},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: MatSnackBar, useValue: snackbarStub }
      ],
      imports: [ FormsModule, MatFormFieldModule, MatCardModule, MatCheckboxModule, MatInputModule, BrowserAnimationsModule, MatTabsModule ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
