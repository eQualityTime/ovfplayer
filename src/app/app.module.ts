
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { WebStorageModule } from 'ngx-store';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ButtonPageComponent } from './button-page/button-page.component';
import { ConfigPageComponent } from './config-page/config-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ObfButtonComponent } from './obf-button/obf-button.component';
import { SpeechbarComponent } from './speechbar/speechbar.component';
import { GlobalErrorHandlerService } from './services/error/global-error-handler.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { OBFPageComponent } from './obfpage/obfpage.component';
import { ProgressComponent } from './progress/progress.component';
import { InteractionEventHandlerDirective } from './interaction-event-handler.directive';

@NgModule({
  declarations: [
    AppComponent,
    ButtonPageComponent,
    SpeechbarComponent,
    ConfigPageComponent,
    MainPageComponent,
    ObfButtonComponent,
    ErrorPageComponent,
    OBFPageComponent,
    ProgressComponent,
    InteractionEventHandlerDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    LayoutModule,
    AppRoutingModule,
    WebStorageModule,
    MatRippleModule,
    MatSliderModule,
    MatRadioModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: ErrorHandler, useClass: GlobalErrorHandlerService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
