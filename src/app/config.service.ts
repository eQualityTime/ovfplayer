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
import { LocalStorage } from 'ngx-store';

export interface ButtonDisplayConfig {
  showSpeakButton: boolean;
  showBackspaceButton: boolean;
  showClearButton: boolean;
  showHomeButton: boolean;
}

export interface ScanningConfig {
  enabled: boolean;
  time: number;
}

export interface AppearanceConfig {
  borderThickness: number;
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
  @LocalStorage() _scanningConfig: ScanningConfig = {
    enabled: false,
    time: 1000,
  };
  @LocalStorage() _appearanceConfig: AppearanceConfig = {
    borderThickness: 2
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

  get scanningConfig(): ScanningConfig {
    return this._scanningConfig;
  }

  get appearanceConfig(): AppearanceConfig {
    return this._appearanceConfig;
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

  set scanningConfig(scanningConfig: ScanningConfig) {
    this._scanningConfig = scanningConfig;
  }

  set appearanceConfig(appearanceConfig: AppearanceConfig) {
    this._appearanceConfig = appearanceConfig;
  }
}
