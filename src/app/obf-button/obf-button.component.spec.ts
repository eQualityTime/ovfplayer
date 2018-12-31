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

import { ObfButtonComponent } from './obf-button.component';
import { SafePipe } from '../safe.pipe';
import { Button, OBFBoard } from '../obfboard';
import { MatRippleModule } from '@angular/material';

describe('ObfButtonComponent', () => {
  let component: ObfButtonComponent;
  let fixture: ComponentFixture<ObfButtonComponent>;
  let buttonStub: Button;

  beforeEach(async(() => {
    buttonStub = new Button().deserialize({
      label: 'button'
    }, new OBFBoard().deserialize({
        id: 'test',
        grid: {
          rows: 1,
          columns: 1,
          order: [['b1']]
        },
        buttons: [],
        images: [],
        sounds: []
    }));

    TestBed.configureTestingModule({
      imports: [ MatRippleModule ],
      declarations: [ ObfButtonComponent, SafePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObfButtonComponent);
    component = fixture.componentInstance;
    component.butt = buttonStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
