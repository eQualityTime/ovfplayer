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

  @LocalStorage() boardURL = 'https://openboards.s3.amazonaws.com/examples/url_images.obf';
  @LocalStorage() showIconsInSpeechbar = true;
  @LocalStorage() displayedButtons: ButtonDisplayConfig = {
    showSpeakButton: true,
    showBackspaceButton: true,
    showClearButton: true,
    showHomeButton: false
  };

  constructor() { }

  getBoardURL(): string {
    return this.boardURL;
  }

  getDisplayedButtons(): ButtonDisplayConfig {
    return this.displayedButtons;
  }

  shouldShowIconsInSpeechbar(): boolean {
    return this.showIconsInSpeechbar;
  }

  updateBoardURL(boardURL: string) {
    this.boardURL = boardURL;
  }

  updateDisplayedButtons(displayedButtons: ButtonDisplayConfig) {
    this.displayedButtons = displayedButtons;
  }

  updateShowIconsInSpeechBar(showIconsInSpeechbar: boolean) {
    this.showIconsInSpeechbar = showIconsInSpeechbar;
  }
}
