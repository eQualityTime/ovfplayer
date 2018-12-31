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
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-obfpage',
  template: `<div class="obfpage"><div class="inner"><ng-content></ng-content></div></div>`,
  styles: [`
    .obfpage {
      width: 100%;
      height: 100%;
      background-color: lightsteelblue;
      position: absolute;
    }
    .inner {
      margin: 20px;
    }
  `]
})
export class OBFPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
