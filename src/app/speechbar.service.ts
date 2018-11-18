import { Injectable } from '@angular/core';
import { Button } from './obfboard';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechbarService {

  private buttons: Button[] = [];
  private speechSynthesizer: SpeechSynthesis = (<any>window).speechSynthesis;
  private listener: Observer<boolean>;

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
      msg.onstart = () => this.listener.next(true);
      msg.onend = () => this.listener.next(false);
      this.speechSynthesizer.speak(msg);

    }
  }

  getButtons() {
    return this.buttons;
  }

  getSpeaking(): Observable<boolean> {
    return new Observable<boolean>(this.addListener);
  }

  addListener = (listener: Observer<boolean>) => {
    // TODO: check if we already have one and error?
    this.listener = listener;
    this.listener.next(this.speechSynthesizer && this.speechSynthesizer.speaking);
  }
}
