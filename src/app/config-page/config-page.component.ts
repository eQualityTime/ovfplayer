/*
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
*/
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService, ButtonDisplayConfig, ScanningConfig } from '../config.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css']
})
export class ConfigPageComponent implements OnInit {

  PAGESET_PARAM = 'pagesetURL';

  @Input() boardURL: string;
  @Input() showIconsInSpeechbar: boolean;
  @Input() speakOnSpeechbarClick: boolean;
  @Input() displayedButtons: ButtonDisplayConfig;
  @Input() scanningConfig: ScanningConfig;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.boardURL = this.configService.boardURL;
    this.displayedButtons = this.configService.displayedButtons;
    this.showIconsInSpeechbar = this.configService.showIconsInSpeechbar;
    this.speakOnSpeechbarClick = this.configService.speakOnSpeechbarClick;
    this.scanningConfig = this.configService.scanningConfig;

    const configURLParam = this.route.snapshot.queryParamMap.get(this.PAGESET_PARAM);
    if (configURLParam) {
      this.boardURL = configURLParam;
      this.save();
    }
  }

  save() {
    this.configService.boardURL = this.boardURL;
    this.configService.displayedButtons = this.displayedButtons;
    this.configService.showIconsInSpeechbar = this.showIconsInSpeechbar;
    this.configService.speakOnSpeechbarClick = this.speakOnSpeechbarClick;
    this.configService.scanningConfig = this.scanningConfig;
    // TODO: some kind of validation
    this.router.navigate(['/main']);
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
}
