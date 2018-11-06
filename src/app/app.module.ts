import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';

import { WebStorageModule } from 'ngx-store';

import { AppComponent } from './app.component';
import { ButtonPageComponent } from './button-page/button-page.component';
import { MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { SpeechbarComponent } from './speechbar/speechbar.component';
import { AppRoutingModule } from './app-routing.module';
import { ConfigPageComponent } from './config-page/config-page.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonPageComponent,
    SpeechbarComponent,
    ConfigPageComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    LayoutModule,
    AppRoutingModule,
    WebStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
