import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public router: Router) { }
  canActivate(): boolean {
    // const userType = localStorage.getItem('userType');
    // if (userType !== 'ADMIN' && userType !== 'SUPER_ADMIN') {
    //   this.router.navigate(['donate']);
    //   return false;
    // }
    return true;
  }
}