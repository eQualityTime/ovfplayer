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

  @LocalStorage() _boardURL = 'https://openboards.s3.amazonaws.com/examples/url_images.obf';
  @LocalStorage() _showIconsInSpeechbar = true;
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

  set boardURL(boardURL: string) {
    this._boardURL = boardURL;
  }

  set displayedButtons(displayedButtons: ButtonDisplayConfig) {
    this._displayedButtons = displayedButtons;
  }

  set showIconsInSpeechbar(showIconsInSpeechbar: boolean) {
    this._showIconsInSpeechbar = showIconsInSpeechbar;
  }
}
