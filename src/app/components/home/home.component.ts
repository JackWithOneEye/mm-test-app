import { Component, OnInit } from '@angular/core';
import { isNil } from 'lodash';
import { UserData } from 'src/app/auth/auth.constants';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  loggingOut = false;
  userData: UserData;

  constructor(
    private authService: AuthService
  ) {}

  logOut = (): void => {
    this.authService.logOut();
  };

  ngOnInit(): void {
    const ud = this.authService.userData;
    if (!isNil(ud)) {
      this.userData = ud;
    }
  }
}
