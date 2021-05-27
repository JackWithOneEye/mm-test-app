import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  eMailInput = '';
  inProcess = false;
  loginFailed = false;
  passwordInput = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  submitCredentials = (): void => {
    this.inProcess = true;
    this.loginFailed = false;
    this.authService.logIn(this.eMailInput, this.passwordInput)
      .subscribe({
        next: (success) => {
          if (success === true) {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: error => {
          console.error(error);
          this.loginFailed = true;
          this.inProcess = false;
        }
      });
  };
}
