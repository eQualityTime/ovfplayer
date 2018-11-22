import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error: any) {
    const zone = this.injector.get(NgZone);
    const router = this.injector.get(Router);
    console.log(`Error at ${router.url}: ${error.message}`);
    zone.run(() => {
      router.navigate(['/error']);
    });
  }
}
