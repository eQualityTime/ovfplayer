import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPageComponent } from './button-page.component';
import { BoardService } from '../board.service';
import { SpeechbarService } from '../speechbar.service';
import { SafePipe } from '../safe.pipe';
import { of } from 'rxjs';
import { OBFBoard } from '../obfboard';
import { ObfButtonComponent } from '../obf-button/obf-button.component';
import { PageTurnerDirective } from '../page-turner.directive';
import { MatRippleModule } from '@angular/material';

describe('ButtonPageComponent', () => {
  let component: ButtonPageComponent;
  let fixture: ComponentFixture<ButtonPageComponent>;
  let boardServiceStub: Partial<BoardService>;
  let speechbarServiceStub: Partial<SpeechbarService>;

  beforeEach(async(() => {

    boardServiceStub = {
      home: () => {},
      getBoard: () => of(new OBFBoard().deserialize({
        id: 'test',
        grid: {
          rows: 1,
          columns: 1,
          order: [['b1']]
        },
        buttons: [],
        images: [],
        sounds: []
      }))
    };
    speechbarServiceStub = {
      clear: () => {},
      backspace: () => {},
      speak: () => {}
    };

    TestBed.configureTestingModule({
      imports: [ MatRippleModule ],
      declarations: [ ButtonPageComponent, SafePipe, ObfButtonComponent, PageTurnerDirective ],
      providers: [
        {provide: BoardService, useValue: boardServiceStub},
        {provide: SpeechbarService, useValue: speechbarServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
