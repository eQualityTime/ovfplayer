/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020, ©2021
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
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService, ButtonDisplayConfig, ScanningConfig, AppearanceConfig, ButtonBehaviourConfig,
  InteractionEventType, VoiceConfig} from '../services/config/config.service';
import { MatSnackBar } from '@angular/material';
import { VERSION } from '../../environments/version';
import { BoardCacheService } from '../services/board/board-cache.service';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css']
})
export class ConfigPageComponent implements OnInit {

  PAGESET_PARAM = 'pagesetURL';

  boardURL: string;
  showIconsInSpeechbar: boolean;
  speakOnSpeechbarClick: boolean;
  displayedButtons: ButtonDisplayConfig;
  scanningConfig: ScanningConfig;
  appearanceConfig: AppearanceConfig;
  buttonBehaviourConfig: ButtonBehaviourConfig;
  voiceConfig: VoiceConfig;
  interactionEventType = InteractionEventType;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private boardCache: BoardCacheService) { }

  ngOnInit() {
    this.boardURL = this.configService.boardURL;
    this.displayedButtons = this.copyConfig(this.configService.displayedButtons);
    this.showIconsInSpeechbar = this.configService.showIconsInSpeechbar;
    this.speakOnSpeechbarClick = this.configService.speakOnSpeechbarClick;
    this.scanningConfig = this.copyConfig(this.configService.scanningConfig);
    this.appearanceConfig = this.copyConfig(this.configService.appearanceConfig);
    this.buttonBehaviourConfig = this.copyConfig(this.configService.buttonBehaviourConfig);
    this.voiceConfig = this.copyConfig(this.configService.voiceConfig);

    const configURLParam = this.route.snapshot.queryParamMap.get(this.PAGESET_PARAM);
    if (configURLParam) {
      this.boardURL = configURLParam;
      this.save();
    }
  }

  private copyConfig(config: any): any {
    return JSON.parse(JSON.stringify(config));
  }

  save() {
    this.configService.boardURL = this.boardURL;
    this.configService.displayedButtons = this.displayedButtons;
    this.configService.showIconsInSpeechbar = this.showIconsInSpeechbar;
    this.configService.speakOnSpeechbarClick = this.speakOnSpeechbarClick;
    this.configService.scanningConfig = this.scanningConfig;
    this.configService.appearanceConfig = this.appearanceConfig;
    this.configService.buttonBehaviourConfig = this.buttonBehaviourConfig;
    this.configService.voiceConfig = this.voiceConfig;
    // TODO: some kind of validation

    // clear local cache of page to force a refresh
    this.boardCache.clear().subscribe(
      () => {
        this.router.navigate(['/main']);
      },
      (error) => {
        // not much we can do really
        console.error('Error clearing cache', error);
        this.router.navigate(['/main']);
      }
    );
  }

  copyToClipboard() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = `${document.location.href}?${this.PAGESET_PARAM}=${encodeURI(this.boardURL)}`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snackBar.open('Configuration link copied to clipboard', '', { duration: 1000 });
  }

  getVersion() {
    return VERSION.tag;
  }

  borderThicknessChange(event: any) {
    this.appearanceConfig.borderThickness = event.value;
  }

  availableVoices() {
    return (<any>window).speechSynthesis.getVoices();
  }
}
