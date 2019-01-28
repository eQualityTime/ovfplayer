import { Directive, HostListener, Input } from '@angular/core';
import { ConfigService } from './config.service';

@Directive({
  selector: '[appInteractionEventHandler]'
})
export class InteractionEventHandlerDirective {

  @Input('appInteractionEventHandler')
  private appInteractionEventHandler: () => void;

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
      this.appInteractionEventHandler();
    }
  }
}
