import { ConfigGuardService } from './config-guard.service';
import { ConfigPageComponent } from './config-page/config-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'main', component: MainPageComponent, canActivate: [ConfigGuardService] },
  { path: 'config', component: ConfigPageComponent },
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
