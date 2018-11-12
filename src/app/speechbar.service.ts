import { Injectable } from '@angular/core';
import { Button } from './obfboard';

@Injectable({
  providedIn: 'root'
})
export class SpeechbarService {

  private buttons: Button[] = [];

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
    const msg = new SpeechSynthesisUtterance();
    const vocalizations = this.buttons.map(button => button.getVocalization());
    msg.text = vocalizations.join(' ');
    (<any>window).speechSynthesis.speak(msg);
  }

  getButtons() {
    return this.buttons;
  }
}
