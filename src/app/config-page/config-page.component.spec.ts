import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ConfigPageComponent } from './config-page.component';
import { ConfigService } from '../config.service';
import { MatFormFieldModule, MatCardModule, MatCheckboxModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('ConfigPageComponent', () => {
  let component: ConfigPageComponent;
  let fixture: ComponentFixture<ConfigPageComponent>;
  let configServiceStub: Partial<ConfigService>;
  let routerStub: Partial<Router>;

  beforeEach(async(() => {
    routerStub = {};
    configServiceStub = {
      getBoardURL: () => '',
      getDisplayedButtons: () =>  {
        return {
          showSpeakButton: false,
          showHomeButton: false,
          showBackspaceButton: false,
          showClearButton: false
        };
      }
    };

    TestBed.configureTestingModule({
      declarations: [ ConfigPageComponent ],
      providers: [
        {provide: Router, useValue: routerStub},
        {provide: ConfigService, useValue: configServiceStub}
      ],
      imports: [ FormsModule, MatFormFieldModule, MatCardModule, MatCheckboxModule, MatInputModule, BrowserAnimationsModule ]
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
