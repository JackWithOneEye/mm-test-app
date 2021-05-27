import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { APP_PATHS } from './auth.constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const loggedIn = this.authService.isLoggedIn;
    if (!loggedIn) {
      this.router.navigate([APP_PATHS.login]);
    }
    return loggedIn;
  }
}
