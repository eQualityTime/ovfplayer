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
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {
    registerServiceWorker('service-worker');
  });

function registerServiceWorker(swName: string) {
  if (environment.production && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(`/${environment.context}/${swName}.js`)
      .then(reg => {
        console.log('Successful service worker registration', reg);
      })
      .catch(err =>
        console.error('Service worker registration failed', err)
      );
  } else if (environment.production) {
    console.error('Service Worker API is not supported in current browser');
  }
}
