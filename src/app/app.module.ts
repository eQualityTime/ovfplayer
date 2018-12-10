import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';

import { MatMenuModule, MatIconModule, MatButtonModule, MatInputModule, MatRippleModule, MatGridListModule, MatCardModule,
  MatFormFieldModule, MatCheckboxModule, MatSnackBarModule, MatTabsModule } from '@angular/material';

import { WebStorageModule } from 'ngx-store';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ButtonPageComponent } from './button-page/button-page.component';
import { ConfigPageComponent } from './config-page/config-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ObfButtonComponent } from './obf-button/obf-button.component';
import { SpeechbarComponent } from './speechbar/speechbar.component';
import { SafePipe } from './safe.pipe';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { OBFPageComponent } from './obfpage/obfpage.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonPageComponent,
    SpeechbarComponent,
    ConfigPageComponent,
    MainPageComponent,
    SafePipe,
    ObfButtonComponent,
    ErrorPageComponent,
    OBFPageComponent
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
    MatRippleModule
  ],
  providers: [
    {
      provide: ErrorHandler, useClass: GlobalErrorHandlerService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
