import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechbarComponent } from './speechbar.component';

describe('SpeechbarComponent', () => {
  let component: SpeechbarComponent;
  let fixture: ComponentFixture<SpeechbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechbarComponent ]
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
