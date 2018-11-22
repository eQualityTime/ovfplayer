import { ConfigGuardService } from './config-guard.service';
import { ConfigPageComponent } from './config-page/config-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  { path: 'main', component: MainPageComponent, canActivate: [ConfigGuardService] },
  { path: 'config', component: ConfigPageComponent },
  { path: 'error', component: ErrorPageComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', component: MainPageComponent, canActivate: [ConfigGuardService] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true}),
    CommonModule
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
