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
