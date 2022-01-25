import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AppService } from '../app.service';

@Injectable()
export class SessionGuardService implements CanActivate {

  constructor(public router: Router, private appService: AppService) { }

  canActivate(): boolean {
    if (this.appService.isLoggedIn()) {
      this.router.navigate(['user']);
      return false;
    }
    return true;
  }
}