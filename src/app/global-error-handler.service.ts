import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FatalOpenVoiceFactoryError } from './errors';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: any) {
    const zone   = this.injector.get(NgZone);
    const router = this.injector.get(Router);

    // TODO: buffer logs
    console.log(`Error at ${router.url}: ${error.message}`);

    // if we've got a fatal error then go to the error page
    if ('FatalOpenVoiceFactoryError' === error.clz) {
      zone.run(() => {
        router.navigate(['/error']);
      });
    }
  }
}
