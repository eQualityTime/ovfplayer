/* ::START::LICENCE::
Copyright eQualityTime ©2018
This file is part of OVFPlayer.
OVFPlayer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
OVFPlayer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with OVFPlayer.  If not, see <https://www.gnu.org/licenses/>.
::END::LICENCE:: */
import { Injectable } from '@angular/core';
import { Button, Image, OBFBoard, LoadBoardAction } from '../../obfboard';
import { Observable, Observer } from 'rxjs';
import { ConfigService } from '../config/config.service';

export class ButtonFacade extends Button {

  private button: Button;
  private appendages: string[] = [];

  constructor(button: Button) {
    super();
    this.button = button;
  }

  append(appendage: string) {
    this.appendages.push(appendage);
  }

  getVocalization(): string {
    return this.vocalization || this.label;
  }

  getImage(): Image {
    return this.button.getImage();
  }

  private augment(initial: string): string {
    return [initial].concat(this.appendages).join('');
  }

  get id(): string {
    return this.button.id;
  }

  get label(): string {
    return this.augment(this.button.label);
  }

  get vocalization(): string {
    return this.button.vocalization ? this.augment(this.button.vocalization) : this.button.vocalization;
  }

  get imageId(): string {
    return this.button.imageId;
  }

  get soundId(): string {
    return this.button.soundId;
  }

  get backgroundColor(): string {
    return this.button.backgroundColor;
  }

  get borderColor(): string {
    return this.button.borderColor;
  }

  get actions(): string[] {
    return this.button.actions;
  }

  get loadBoardAction(): LoadBoardAction {
    return this.button.loadBoardAction;
  }

  get parent(): OBFBoard {
    return this.button.parent;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SpeechbarService {

  private buttons: ButtonFacade[] = [];
  private speechSynthesizer: SpeechSynthesis = (<any>window).speechSynthesis;
  private listener: Observer<boolean>;
  private buttonObserver: Observer<Button[]>;
  private spaceJustPressed = false;
  private userVoice: SpeechSynthesisVoice;

  constructor(private configService: ConfigService) {
    this.configService.voiceConfig$.subscribe(
      voiceConfig => {
        if (voiceConfig.userVoice) {
          this.userVoice = this.speechSynthesizer.getVoices().find(voice => voice.voiceURI === voiceConfig.userVoice);
        }
      }
    );
  }

  addButton(button: Button) {
    this.spaceJustPressed = false;
    this.buttons.push(new ButtonFacade(button));
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
      const msg = this.createUtterance();
      msg.text = this.buildSentence(this.buttons.map(button => button.getVocalization()));

      msg.onstart = () => this.listener.next(true);
      msg.onend = () => this.listener.next(false);
      this.speechSynthesizer.speak(msg);
    }
  }

  buildSentence(vocalizations: string[]): string {
    if (vocalizations.length === 0) {
      return '';
    }
    const ret = vocalizations.join(' ');
    const lastChar = ret[ret.length - 1];
    const endsWithPunc = lastChar === '?' || lastChar === '!' || lastChar === '.';
    return endsWithPunc ? ret : ret + ' .';
  }

  sayButton(button: Button) {
    // we do want to queue these up, so no speaking check
    // we also want the speak button to stay enabled for queing up the actual message, so no listener updates
    const msg = this.createUtterance();
    msg.text = this.buildSentence([button.getVocalization()]);
    this.speechSynthesizer.speak(msg);
  }

  private createUtterance(): any {
    const msg = new SpeechSynthesisUtterance();

    if (this.userVoice) {
      msg.voice = this.userVoice;
    }

    return msg;
  }

  appendButton(button: Button, action: string) {
    if (this.buttons.length === 0 || this.spaceJustPressed) {
      this.spaceJustPressed = false;
      const appendBut = new Button();
      appendBut.label = action.substr(1);
      this.buttons.push(new ButtonFacade(appendBut));
      this.notifyButtonObserver();
    } else {
      this.spaceJustPressed = false;
      this.buttons[this.buttons.length - 1].append(action.substr(1));
      this.notifyButtonObserver();
    }
  }

  space() {
    this.spaceJustPressed = true;
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
    this.listener = listener;
    this.listener.next(this.speechSynthesizer && this.speechSynthesizer.speaking);
  }
}
