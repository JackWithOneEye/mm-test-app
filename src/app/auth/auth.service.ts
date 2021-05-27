import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isNil } from 'lodash';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APP_PATHS, UserData } from './auth.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;
  private userSubject: BehaviorSubject<UserData> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  logIn = (eMail: string, password: string): Observable<boolean> => {
    return this.http.post<UserData>('/authorize', { eMail, password })
      .pipe(
        map(responseBody => {
          this.userSubject.next(responseBody);
          return this.loggedIn = !isNil(responseBody);
        }),
        catchError(err => {
          this.loggedIn = false;
          return throwError(err);
        })
      );
  };

  logOut = () : void => {
    this.userSubject.next(null);
    this.loggedIn = false;
    this.router.navigate([APP_PATHS.login]);
  };

  get isLoggedIn(): boolean {
    return this.loggedIn;
  }

  get userData(): UserData {
    return this.userSubject.value;
  }
}
