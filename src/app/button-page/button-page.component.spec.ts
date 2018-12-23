/* ::START::LICENCE::
Copyright ©2018
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
import { SafePipe } from '../safe.pipe';
import { of } from 'rxjs';
import { OBFBoard } from '../obfboard';
import { ObfButtonComponent } from '../obf-button/obf-button.component';
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
        buttons: [{
          id: 'b1',
          label: 'test'
        }],
        images: [],
        sounds: []
      }))
    };
    speechbarServiceStub = {
      clear: () => {},
      backspace: () => {},
      speak: () => {},
      space: () => {}
    };

    TestBed.configureTestingModule({
      imports: [ MatRippleModule ],
      declarations: [ ButtonPageComponent, SafePipe, ObfButtonComponent ],
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
