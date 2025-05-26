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
import { enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { GlobalErrorHandlerService } from './app/services/error/global-error-handler.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from './app/app-routing.module';
import { WebStorageModule } from '@efaps/ngx-store';
import { MatRippleModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, MatGridListModule, MatCardModule, MatFormFieldModule, MatCheckboxModule, MatMenuModule, MatIconModule, MatInputModule, MatButtonModule, MatSnackBarModule, MatTabsModule, LayoutModule, AppRoutingModule, WebStorageModule, MatRippleModule, MatSliderModule, MatRadioModule, MatSelectModule),
        {
            provide: ErrorHandler, useClass: GlobalErrorHandlerService
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
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
