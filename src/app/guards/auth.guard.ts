// import { Injectable } from '@angular/core';
// import { CanActivate } from '@angular/router';
// import { LoginService } from '../services/login.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private loginService: LoginService) {

//   }
//   canActivate(): Boolean {
//     return this.loginService.isAuthenticated();
//   }
// }
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public auth: LoginService) { }

  canActivate(): boolean {
    return this.auth.isAuthenticated();
  }
}