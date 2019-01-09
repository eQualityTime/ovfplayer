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
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Button } from '../obfboard';
import { DomSanitizer } from '@angular/platform-browser';

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

  private url: string;

  constructor(private domSanit: DomSanitizer) {}

  ngOnInit() { }

  getDataURL() {
    this.url = URL.createObjectURL(this.butt.getImage().getDataBlob());
    return this.domSanit.bypassSecurityTrustUrl(this.url);
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
}
