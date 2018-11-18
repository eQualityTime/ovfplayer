import { Injectable } from '@angular/core';
import { Button } from './obfboard';

@Injectable({
  providedIn: 'root'
})
export class SpeechbarService {

  private buttons: Button[] = [];
  private speechSynthesizer: SpeechSynthesis = (<any>window).speechSynthesis;

  constructor() { }

  addButton(button: Button) {
    this.buttons.push(button);
    console.log(button.label);  // TODO : remove
  }

  clear() {
    this.buttons = [];
  }

  backspace() {
    this.buttons.pop();
  }

  speak() {
    // don't queue up multiple speak actions
    if (!this.speechSynthesizer.speaking) {
      const msg = new SpeechSynthesisUtterance();
      const vocalizations = this.buttons.map(button => button.getVocalization());
      msg.text = vocalizations.join(' ');
      this.speechSynthesizer.speak(msg);
    }
  }

  getButtons() {
    return this.buttons;
  }
}
