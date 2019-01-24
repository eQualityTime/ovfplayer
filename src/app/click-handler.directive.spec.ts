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

describe('ClickHandlerDirective', () => {

  let component: TestClickHandlerComponent;
  let directive: ClickHandlerDirective;
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
    const directiveEl = fixture.debugElement.query(By.directive(ClickHandlerDirective));
    directive = directiveEl.injector.get(ClickHandlerDirective);

    spyOn(component, 'testHandler');
    spyOn(directive, 'handleEvent').and.callThrough();
    spyOn(directive, 'onClick').and.callThrough();
    spyOn(directive, 'onPress').and.callThrough();
    spyOn(directive, 'onRelease').and.callThrough();
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should fire on configured trigger', fakeAsync( () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    div.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(directive.handleEvent).toHaveBeenCalled();
    expect(component.testHandler).toHaveBeenCalled();
  }));

  it('should not fire on not the configured trigger', fakeAsync( () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    div.triggerEventHandler('mousedown', null);
    div.triggerEventHandler('mouseup', null);
    tick();
    fixture.detectChanges();
    expect(directive.handleEvent).toHaveBeenCalled();
    expect(component.testHandler).not.toHaveBeenCalled();
  }));

  it('should handle moousedown', fakeAsync( () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    div.triggerEventHandler('mousedown', null);
    tick();
    fixture.detectChanges();
    expect(directive.onPress).toHaveBeenCalled();
    expect(directive.handleEvent).toHaveBeenCalled();
  }));

  it('should handle moouseup', fakeAsync( () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    div.triggerEventHandler('mouseup', null);
    tick();
    fixture.detectChanges();
    expect(directive.onRelease).toHaveBeenCalled();
    expect(directive.handleEvent).toHaveBeenCalled();
  }));

  it('should handle click', fakeAsync( () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('div'));
    div.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(directive.onClick).toHaveBeenCalled();
    expect(directive.handleEvent).toHaveBeenCalled();
  }));
});
