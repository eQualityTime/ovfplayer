import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material';

import { MainPageComponent } from './main-page.component';
import { SpeechbarComponent } from '../speechbar/speechbar.component';
import { ButtonPageComponent } from '../button-page/button-page.component';
import { SafePipe } from '../safe.pipe';
import { ObfButtonComponent } from '../obf-button/obf-button.component';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPageComponent, SpeechbarComponent, ButtonPageComponent, SafePipe, ObfButtonComponent ],
      imports: [ MatCardModule, HttpClientTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
