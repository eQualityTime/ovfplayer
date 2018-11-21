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
  private buttonObserver: Observer<Button[]>;

  constructor() { }

  addButton(button: Button) {
    this.buttons.push(button);
    this.notifyButtonObserver();
  }

  clear() {
    this.buttons = [];
    this.notifyButtonObserver();
  }

  backspace() {
    this.buttons.pop();
    this.notifyButtonObserver();
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

  private notifyButtonObserver() {
    this.buttonObserver.next(this.buttons);
  }

  getButtons(): Observable<Button[]> {
    return new Observable<Button[]>(this.addButtonObserver);
  }

  getSpeaking(): Observable<boolean> {
    return new Observable<boolean>(this.addListener);
  }

  addButtonObserver = (observer: Observer<Button[]>) => {
    this.buttonObserver = observer;
    this.buttonObserver.next(this.buttons);
  }

  addListener = (listener: Observer<boolean>) => {
    // TODO: check if we already have one and error?
    this.listener = listener;
    this.listener.next(this.speechSynthesizer && this.speechSynthesizer.speaking);
  }
}
