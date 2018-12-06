import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechbarComponent } from './speechbar.component';
import { ConfigService } from '../config.service';
import { BoardService } from '../board.service';
import { SpeechbarService } from '../speechbar.service';
import { ObfButtonComponent } from '../obf-button/obf-button.component';
import { SafePipe } from '../safe.pipe';
import { MatRippleModule, MatCardModule } from '@angular/material';
import { Observable } from 'rxjs';

describe('SpeechbarComponent', () => {
  let component: SpeechbarComponent;
  let fixture: ComponentFixture<SpeechbarComponent>;
  let configServiceStub: Partial<ConfigService>;
  let boardServiceStub: Partial<BoardService>;
  let speechbarServiceStub: Partial<SpeechbarService>;

  beforeEach(async(() => {
    configServiceStub = {
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
    boardServiceStub = {};
    speechbarServiceStub = {
      getButtons: () => new Observable(() => {}),
      getSpeaking: () => new Observable(() => {})
    };

    TestBed.configureTestingModule({
      declarations: [ SpeechbarComponent, ObfButtonComponent, SafePipe ],
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
