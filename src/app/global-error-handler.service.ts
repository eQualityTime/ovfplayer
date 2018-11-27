import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: any) {
    const zone   = this.injector.get(NgZone);
    const router = this.injector.get(Router);

    // TODO: buffer logs
    console.log(`Error on page ${router.url}: ${error.message}`);

    // Pull reason out of a promise error if it is one
    if (error.rejection) {
      error = error.rejection;
    }

    let cause = error.cause;
    while (cause) {
      console.log(`Caused by: ${cause.toString()}`);
      cause = cause.cause;
      // TODO: decent stack trace?
    }

    // if we've got a fatal error then go to the error page
    if ('FatalOpenVoiceFactoryError' === error.clz) {
      zone.run(() => {
        router.navigate(['/error']);
      });
    }
  }
}