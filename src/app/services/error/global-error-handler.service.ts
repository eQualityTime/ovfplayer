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
import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorDetails, ErrorService } from './error.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: any) {

    const zone   = this.injector.get(NgZone);
    const router = this.injector.get(Router);
    const errSer = this.injector.get(ErrorService);

    console.error(error);
    // TODO: buffer logs
    console.log(`Error on page ${router.url}: ${error.message}`);

    // Pull reason out of a promise error if it is one
    if (error.rejection) {
      error = error.rejection;
    }

    const errorDetails = new ErrorDetails();
    errorDetails.message = error.message;
    errorDetails.location = router.url;

    let cause = error.cause;
    while (cause) {
      errorDetails.causeChain = errorDetails.causeChain ? errorDetails.causeChain + '\n' + cause.toString() : cause.toString();
      console.log(`Caused by: ${cause.toString()}`);
      cause = cause.cause;
      // TODO: decent stack trace?
    }

    errSer.lastError = errorDetails;

    // if we've got a fatal error then go to the error page
    if ('FatalOpenVoiceFactoryError' === error.clz) {
      zone.run(() => {
        router.navigate(['/error']);
      });
    }
  }
}
