/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020
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
import { Component, OnInit, Input, OnDestroy, HostBinding } from '@angular/core';
import { Button } from '../obfboard';
import { DomSanitizer } from '@angular/platform-browser';
import { AppearanceConfig, ConfigService } from '../services/config/config.service';

@Component({
  selector: 'app-obf-button',
  templateUrl: './obf-button.component.html',
  styleUrls: ['./obf-button.component.css']
})
export class ObfButtonComponent implements OnInit, OnDestroy {

  @Input()
  butt: Button;

  @Input()
  clickHandler: (Button) => void;

  appearanceConfig: AppearanceConfig;

  private url: string;

  constructor(private domSanit: DomSanitizer, private config: ConfigService) {}

  @HostBinding('attr.style')
  public get valueAsStyle(): any {
    return this.domSanit.bypassSecurityTrustStyle(`--borderWidth: ${this.appearanceConfig.borderThickness + 'px'}`);
  }

  ngOnInit() {
    this.appearanceConfig = this.config.appearanceConfig;
  }

  getDataURL() {
    try {
      this.url = URL.createObjectURL(this.butt.getImage().getDataBlob());
      return this.domSanit.bypassSecurityTrustUrl(this.url);
    } catch (e) {
      // TODO: poke global error handler to add error to buffer
      return '';
    }
  }

  ngOnDestroy() {
    this.unload();
  }

  private unload() {
    if (this.url) {
      URL.revokeObjectURL(this.url);
      this.url = undefined;
    }
  }

  handleClick() {
    if (this.clickHandler) {
      this.clickHandler(this.butt);
    }
  }
}
