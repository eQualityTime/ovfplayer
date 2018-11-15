import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigGuardService implements CanActivate {

  constructor(private router: Router, private config: ConfigService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // TODO: check more config and possibly validate it
    const hasConfig = this.config.boardURL;
    if (hasConfig) {
      return true;
    } else {
      console.log('Redirecting to /config due to no config');
      this.router.navigate(['/config']);
      return false;
    }
  }
}
