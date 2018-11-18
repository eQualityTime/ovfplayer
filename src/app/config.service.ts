import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-store';

export interface ButtonDisplayConfig {
  showSpeakButton: boolean;
  showBackspaceButton: boolean;
  showClearButton: boolean;
  showHomeButton: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  @LocalStorage() _boardURL = 'https://dl.dropboxusercontent.com/s/oiwfo47fprv3jl4/ck20.obz?dl=1';
  @LocalStorage() _showIconsInSpeechbar = true;
  @LocalStorage() _speakOnSpeechbarClick = true;
  @LocalStorage() _displayedButtons: ButtonDisplayConfig = {
    showSpeakButton: true,
    showBackspaceButton: true,
    showClearButton: true,
    showHomeButton: false
  };

  constructor() { }

  get boardURL(): string {
    return this._boardURL;
  }

  get displayedButtons(): ButtonDisplayConfig {
    return this._displayedButtons;
  }

  get showIconsInSpeechbar(): boolean {
    return this._showIconsInSpeechbar;
  }

  get speakOnSpeechbarClick(): boolean {
    return this._speakOnSpeechbarClick;
  }

  set boardURL(boardURL: string) {
    this._boardURL = boardURL;
  }

  set displayedButtons(displayedButtons: ButtonDisplayConfig) {
    this._displayedButtons = displayedButtons;
  }

  set showIconsInSpeechbar(showIconsInSpeechbar: boolean) {
    this._showIconsInSpeechbar = showIconsInSpeechbar;
  }
  set speakOnSpeechbarClick(speakOnSpeechbarClick: boolean) {
    this._speakOnSpeechbarClick = speakOnSpeechbarClick;
  }
}
