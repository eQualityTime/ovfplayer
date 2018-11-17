import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appPageTurner]'
})
export class PageTurnerDirective {

  @Input() appPageTurnerDisabled: boolean;
  @Input() class: string;

  @HostBinding('class')
  get elementClass(): string {
    const existing = this.class ? this.class : '';
    return this.appPageTurnerDisabled ? existing : 'pageTurn ' + existing;
  }

  constructor() {
  }
}
