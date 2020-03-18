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
import { Component, OnInit } from '@angular/core';
import { ErrorService, ErrorDetails } from '../services/error/error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  error: ErrorDetails;

  constructor(private errorService: ErrorService, private router: Router) { }

  ngOnInit() {
    this.error = this.errorService.lastError;
  }

  goToConfig() {
    this.router.navigate(['/config']);
  }

  get errorHRef(): string {
    let href = 'mailto:support@equalitytime.co.uk';
    href += '?subject=' + encodeURI(this.error.message);
    href += '&body=' + encodeURI(this.errorAsString());
    return href;
  }

  private errorAsString(): string {
    let errorString = 'Location: ' + this.error.location;
    errorString += '\nMessage: ' + this.error.message;
    errorString += '\nCause: ' + this.error.causeChain;
    return errorString;
  }
}
