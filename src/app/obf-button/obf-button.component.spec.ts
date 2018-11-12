import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObfButtonComponent } from './obf-button.component';
import { SafePipe } from '../safe.pipe';
import { Button } from '../obfboard';

describe('ObfButtonComponent', () => {
  let component: ObfButtonComponent;
  let fixture: ComponentFixture<ObfButtonComponent>;
  let buttonStub: Button;

  beforeEach(async(() => {
    buttonStub = new Button().deserialize({
      label: 'button'
    });

    TestBed.configureTestingModule({
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
