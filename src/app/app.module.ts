import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule, MatIconModule, MatButtonModule, MatInputModule, MatRippleModule } from '@angular/material';

import { WebStorageModule } from 'ngx-store';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ButtonPageComponent } from './button-page/button-page.component';
import { ConfigPageComponent } from './config-page/config-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ObfButtonComponent } from './obf-button/obf-button.component';
import { SpeechbarComponent } from './speechbar/speechbar.component';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ButtonPageComponent,
    SpeechbarComponent,
    ConfigPageComponent,
    MainPageComponent,
    SafePipe,
    ObfButtonComponent
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
    LayoutModule,
    AppRoutingModule,
    WebStorageModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
