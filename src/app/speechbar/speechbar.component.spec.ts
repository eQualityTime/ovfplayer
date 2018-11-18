import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { SpeechbarComponent } from './speechbar.component';
import { ConfigService } from '../config.service';
import { BoardService } from '../board.service';
import { SpeechbarService } from '../speechbar.service';
import { ObfButtonComponent } from '../obf-button/obf-button.component';
import { SafePipe } from '../safe.pipe';
import { PageTurnerDirective } from '../page-turner.directive';
import { MatRippleModule } from '@angular/material';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';

describe('SpeechbarComponent', () => {
  let component: SpeechbarComponent;
  let fixture: ComponentFixture<SpeechbarComponent>;
  let configServiceStub: Partial<ConfigService>;
  let boardServiceStub: Partial<BoardService>;
  let speechbarServiceStub: Partial<SpeechbarService>;
  let cdRefStub: Partial<ChangeDetectorRef>;

  beforeEach(async(() => {
    configServiceStub = {
      displayedButtons: {
        showSpeakButton: false,
        showHomeButton: false,
        showBackspaceButton: false,
        showClearButton: false
      }
    };
    boardServiceStub = {};
    speechbarServiceStub = {
      getButtons: () => [],
      getSpeaking: () => new Observable(() => {})
    };
    cdRefStub = {
      detectChanges: () => {}
    };

    TestBed.configureTestingModule({
      declarations: [ SpeechbarComponent, ObfButtonComponent, SafePipe, PageTurnerDirective ],
      providers: [
        {provide: ConfigService, useValue: configServiceStub},
        {provide: BoardService, useValue: boardServiceStub},
        {provide: SpeechbarService, useValue: speechbarServiceStub}
      ],
      imports: [ MatCardModule, MatRippleModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
