import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthRequestBody, extractUserDataFromDBEntry, MOCK_USER_DB, UserData, UserDBEntry } from './auth.constants';
import { forEach, isEmpty, isNil } from 'lodash';
import { delay, dematerialize, materialize } from 'rxjs/operators';

@Injectable()
export class MockAuthBackendInterceptor implements HttpInterceptor {

  // map each user to their e-mail address
  private userByEmail: Record<string, UserDBEntry> = {};

  constructor() {
    forEach(MOCK_USER_DB, userEntry => {
      this.userByEmail[userEntry.eMail] = userEntry;
    });
  }

  intercept = (request: HttpRequest<AuthRequestBody>): Observable<HttpEvent<UserData>> => {
    const { url, method, body } = request;
    if (!url.endsWith('/authorize') || method !== 'POST') {
      return this.errorResponse(404);
    }
    if (isNil(body)) {
      return this.errorResponse(400);
    }
    const { eMail, password } = body;
    if (isEmpty(eMail) || isEmpty(password)) {
      return this.errorResponse(400);
    }
    const foundUser = this.userByEmail[eMail];
    if (isNil(foundUser) || foundUser.password !== password) {
      return this.errorResponse(401);
    }
    return of(new HttpResponse<UserData>({
      status: 200,
      body: extractUserDataFromDBEntry(foundUser)
    }))
      .pipe(delay(500));
  };

  private errorResponse = (status: number): Observable<HttpEvent<UserData>> => {
    return throwError({ status: status, statusText: 'authentication error' })
      .pipe(materialize(), delay(500), dematerialize());
  };
}
