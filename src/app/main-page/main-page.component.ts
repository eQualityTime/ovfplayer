/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020, ©2021, ©2022, ©2023, ©2024, ©2025
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
import { Component } from '@angular/core';
import { ScanningService } from '../services/scanning/scanning.service';
import { ConfigService } from '../services/config/config.service';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { SpeechbarComponent } from '../speechbar/speechbar.component';
import { ButtonPageComponent } from '../button-page/button-page.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
    imports: [NgIf, NgTemplateOutlet, SpeechbarComponent, ButtonPageComponent]
})
export class MainPageComponent {

  constructor(private scanningService: ScanningService, private configService: ConfigService) { }

  scanningEnabled(): boolean {
    return this.configService.scanningConfig.enabled;
  }

  handleClick() {
    this.scanningService.handleInteraction();
  }

}
