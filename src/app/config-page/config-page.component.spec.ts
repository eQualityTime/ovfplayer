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
