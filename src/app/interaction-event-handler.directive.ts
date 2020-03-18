import { Directive, HostListener, Input } from '@angular/core';
import { ConfigService, InteractionEventType } from './services/config/config.service';

@Directive({
  selector: '[appInteractionEventHandler]'
})
export class InteractionEventHandlerDirective {

  @Input('appInteractionEventHandler')
  private appInteractionEventHandler: () => void;

  constructor(private config: ConfigService) { }

  @HostListener('mouseup') onRelease() {
    this.handleEvent(InteractionEventType.mouseup);
  }

  @HostListener('mousedown') onPress() {
    this.handleEvent(InteractionEventType.mousedown);
  }

  @HostListener('click') onClick() {
    this.handleEvent(InteractionEventType.click);
  }

  handleEvent(eventType: InteractionEventType) {
    if (eventType === this.config.buttonBehaviourConfig.triggerEvent) {
      this.appInteractionEventHandler();
    }
  }
}
