/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020, ©2021
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
import { ConfigService, InteractionEventType } from '../services/config/config.service';
import {
  MatFormFieldModule,
  MatCardModule,
  MatCheckboxModule,
  MatInputModule,
  MatSnackBar,
  MatTabsModule,
  MatSliderModule,
  MatIconModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment, Params, Data, Route, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { Type, DebugElement } from '@angular/core';
import { OBFPageComponent } from '../obfpage/obfpage.component';
import { By } from '@angular/platform-browser';

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
        showClearButton: false,
        showBackButton: false
      },
      scanningConfig: {
        enabled: false,
        time: 0
      },
      appearanceConfig: {
        borderThickness: 2,
        highContrastText: false
      },
      buttonBehaviourConfig: {
        speakOnTrigger: false,
        triggerEvent: InteractionEventType.click
      },
      voiceConfig: {
        userVoice: undefined
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
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatCheckboxModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatSliderModule,
        MatIconModule,
        MatRadioModule,
        MatSelectModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    configServiceStub = TestBed.get(ConfigService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not directly reference config service config', () => {
    fixture.detectChanges();
    expect(component.displayedButtons).not.toBe(configServiceStub.displayedButtons);
    expect(component.scanningConfig).not.toBe(configServiceStub.scanningConfig);
    expect(component.appearanceConfig).not.toBe(configServiceStub.appearanceConfig);
    expect(component.buttonBehaviourConfig).not.toBe(configServiceStub.buttonBehaviourConfig);
    expect(component.voiceConfig).not.toBe(configServiceStub.voiceConfig);
  });

  it('should not save config changes if save is not pressed', done => {
    fixture.detectChanges();
    expect(component.displayedButtons).not.toBe(configServiceStub.displayedButtons);
    const displayTab = fixture.nativeElement.querySelector('div.mat-tab-label span[name="displayedButtons"]');
    displayTab.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const showSpeakButton = fixture.debugElement.query(By.css('mat-checkbox[name="showSpeakButton"] label'));
      const theDiv = <DebugElement>showSpeakButton.childNodes[0];
      const theInput = <DebugElement>theDiv.childNodes[0];
      expect(theInput.attributes['aria-checked']).toBe('false');
      expect(configServiceStub.displayedButtons.showSpeakButton).toBeFalsy();
      showSpeakButton.nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // checkbox should now be checked
        expect(theInput.attributes['aria-checked']).toBe('true');
        // internal component state should also be true
        expect(component.displayedButtons.showSpeakButton).toBeTruthy();
        // but actual config should still be false
        expect(configServiceStub.displayedButtons.showSpeakButton).toBeFalsy();
        done();
      });
    });
  });

  it('should save config changes if save is pressed', done => {
    fixture.detectChanges();
    expect(component.displayedButtons).not.toBe(configServiceStub.displayedButtons);
    const displayTab = fixture.nativeElement.querySelector('div.mat-tab-label span[name="displayedButtons"]');
    displayTab.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const showSpeakButton = fixture.debugElement.query(By.css('mat-checkbox[name="showSpeakButton"] label'));
      const theDiv = <DebugElement>showSpeakButton.childNodes[0];
      const theInput = <DebugElement>theDiv.childNodes[0];
      expect(theInput.attributes['aria-checked']).toBe('false');
      expect(configServiceStub.displayedButtons.showSpeakButton).toBeFalsy();
      showSpeakButton.nativeElement.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // checkbox should now be checked
        expect(theInput.attributes['aria-checked']).toBe('true');

        // call save
        component.save();
        fixture.detectChanges();

        // internal component state should also be true
        expect(component.displayedButtons.showSpeakButton).toBeTruthy();
        // config should now also be true
        expect(configServiceStub.displayedButtons.showSpeakButton).toBeTruthy();
        done();
      });
    });
  });
});
