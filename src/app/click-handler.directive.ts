import { Directive, HostListener, Input } from '@angular/core';
import { ConfigService } from './config.service';

@Directive({
  selector: '[appClickHandler]'
})
export class ClickHandlerDirective {

  @Input('appClickHandler')
  private appClickHandler: () => void;

  constructor(private config: ConfigService) { }

  @HostListener('mouseup') onRelease() {
    this.handleEvent('mouseup');
  }

  @HostListener('mousedown') onPress() {
    this.handleEvent('mousedown');
  }

  @HostListener('click') onClick() {
    this.handleEvent('click');
  }

  handleEvent(eventType: string) {
    if (eventType === this.config.buttonBehaviourConfig.triggerEvent) {
      this.appClickHandler();
    }
  }
}
