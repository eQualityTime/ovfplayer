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

import { ButtonPageComponent } from './button-page.component';
import { BoardService } from '../board.service';
import { SpeechbarService } from '../speechbar.service';
import { of } from 'rxjs';
import { OBFBoard, Button } from '../obfboard';
import { ObfButtonComponent } from '../obf-button/obf-button.component';
import { MatRippleModule } from '@angular/material';
import { ProgressComponent } from '../progress/progress.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InteractionEventHandlerDirective } from '../interaction-event-handler.directive';

describe('ButtonPageComponent', () => {
  let component: ButtonPageComponent;
  let fixture: ComponentFixture<ButtonPageComponent>;
  let speechbarService: SpeechbarService;
  let boardService: BoardService;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [ MatRippleModule, HttpClientTestingModule ],
      declarations: [ ButtonPageComponent, ObfButtonComponent, ProgressComponent, InteractionEventHandlerDirective ],
      providers: [ BoardService, SpeechbarService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    speechbarService = TestBed.get(SpeechbarService);
    spyOn(speechbarService, 'clear');
    spyOn(speechbarService, 'appendButton');
    spyOn(speechbarService, 'backspace');
    spyOn(speechbarService, 'speak');
    spyOn(speechbarService, 'space');
    spyOn(speechbarService, 'addButton');

    boardService = TestBed.get(BoardService);
    spyOn(boardService, 'getBoard').and.returnValue(of(new OBFBoard().deserialize({
      id: 'test',
      grid: {
        rows: 1,
        columns: 1,
        order: [['b1']]
      },
      buttons: [{
        id: 'b1',
        label: 'test'
      }],
      images: [],
      sounds: [
        {
          id: '1',
          path: 'sound1'
        }
      ]
    })));
    spyOn(boardService, 'home');
    spyOn(boardService, 'navigateToBoard');
    spyOn(boardService, 'navigateToExternalBoard');

    fixture = TestBed.createComponent(ButtonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle button click - append action', () => {
    const button = { actions: ['+a'] };
    component.handleButtonClick(<Button>button);
    expect(speechbarService.appendButton).toHaveBeenCalled();
  });

  it('should handle button click - clear action', () => {
    const button = { actions: [':clear'] };
    component.handleButtonClick(<Button>button);
    expect(speechbarService.clear).toHaveBeenCalled();
  });

  it('should handle button click - backspace action', () => {
    const button = { actions: [':backspace'] };
    component.handleButtonClick(<Button>button);
    expect(speechbarService.backspace).toHaveBeenCalled();
  });

  it('should handle button click - speak action', () => {
    const button = { actions: [':speak'] };
    component.handleButtonClick(<Button>button);
    expect(speechbarService.speak).toHaveBeenCalled();
  });

  it('should handle button click - space action', () => {
    const button = { actions: [':space'] };
    component.handleButtonClick(<Button>button);
    expect(speechbarService.space).toHaveBeenCalled();
  });

  it('should handle button click - home action', () => {
    const button = { actions: [':home'] };
    component.handleButtonClick(<Button>button);
    expect(boardService.home).toHaveBeenCalled();
  });

  it('should handle button click - multiple actions', () => {
    const button = { actions: [':home', ':space', ':speak'] };
    component.handleButtonClick(<Button>button);
    expect(boardService.home).toHaveBeenCalled();
    expect(speechbarService.space).toHaveBeenCalled();
    expect(speechbarService.speak).toHaveBeenCalled();
  });

  it('should handle button click - add action', () => {
    const button = { label: 'text', actions: [] };
    component.handleButtonClick(<Button>button);
    expect(speechbarService.addButton).toHaveBeenCalled();
  });

  it('should handle button click - loadBoard action', () => {
    const button = { label: 'text', actions: [], loadBoardAction: { path: 'path' } };
    component.handleButtonClick(<Button>button);
    expect(boardService.navigateToBoard).toHaveBeenCalled();
    expect(speechbarService.addButton).not.toHaveBeenCalled();
  });

  it('should handle button click - loadBoard external action', () => {
    const button = { actions: [], loadBoardAction: { dataUrl: 'path' } };
    component.handleButtonClick(<Button>button);
    expect(boardService.navigateToExternalBoard).toHaveBeenCalled();
    expect(speechbarService.addButton).not.toHaveBeenCalled();
  });

  it('should handle button click - loadBoard action with vocalisation', () => {
    const button = { vocalization: 'hello', actions: [], loadBoardAction: { path: 'path' } };
    component.handleButtonClick(<Button>button);
    expect(boardService.navigateToBoard).toHaveBeenCalled();
    expect(speechbarService.addButton).toHaveBeenCalled();
  });

  it('should handle button click - loadBoard url action', () => {
    const button = { actions: [], loadBoardAction: { url: 'path' } };
    component.handleButtonClick(<Button>button);
    expect(speechbarService.addButton).not.toHaveBeenCalled();
  });

  it('should handle button click - sound', () => {
    const button = { actions: [], soundId: '1' };
    component.handleButtonClick(<Button>button);
    expect(speechbarService.addButton).toHaveBeenCalled();
  });

});
