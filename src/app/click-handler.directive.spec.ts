import { ClickHandlerDirective } from './click-handler.directive';
import { ConfigService } from './config.service';
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: '<div [appClickHandler]="testHandler"></div>'
})
class TestClickHandlerComponent {
  testHandler() {
    return 3;
  }
}

describe('ClickHandlerDirective on click', () => {

  let component: TestClickHandlerComponent;
  let fixture: ComponentFixture<TestClickHandlerComponent>;
  let configServiceStub: Partial<ConfigService>;

  beforeEach(async(() => {
    configServiceStub = {
      buttonBehaviourConfig: {
        triggerEvent: 'click'
      }
    };

    TestBed.configureTestingModule({
      declarations: [ TestClickHandlerComponent, ClickHandlerDirective ],
      providers: [
        {provide: ConfigService, useValue: configServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestClickHandlerComponent);
    component = fixture.componentInstance;
    spyOn(component, 'testHandler');
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should fire on configured trigger', fakeAsync( () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    div.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(component.testHandler).toHaveBeenCalled();
  }));

  it('should not fire on not the configured trigger', fakeAsync( () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    div.triggerEventHandler('mousedown', null);
    div.triggerEventHandler('mouseup', null);
    tick();
    fixture.detectChanges();
    expect(component.testHandler).not.toHaveBeenCalled();
  }));
});
