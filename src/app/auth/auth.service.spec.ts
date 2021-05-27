import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { extractUserDataFromDBEntry, MOCK_USER_DB } from './auth.constants';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test login', () => {

    // test login with invalid credentials
    service.logIn('ding', 'dong')
      .subscribe({
        next: success => {
          // this method should not be called
          expect(success).not.toBe(true);
        },
        error: error => {
          expect(error.status).toBe(401);
          expect(service.userData).toEqual(null);
          expect(service.isLoggedIn).toBe(false);
        }
      });

    // pick test user at random
    const TEST_USER_DB_ENTRY = MOCK_USER_DB[Math.floor(Math.random() * (MOCK_USER_DB.length - 1))];
    const expectedUserData = extractUserDataFromDBEntry(TEST_USER_DB_ENTRY);
    // test login with valid credentials
    service.logIn(TEST_USER_DB_ENTRY.eMail, TEST_USER_DB_ENTRY.password)
      .subscribe({
        next: success => {
          expect(success).toBe(true);
          expect(service.userData).toEqual(expectedUserData);
          expect(service.isLoggedIn).toBe(true);
        },
        error: error => {
          // this method should not be called
          expect(error).not.toBeDefined();
        }
      });
    const requests = httpMock.match('/authorize');
    expect(requests.length).toEqual(2);
    requests.forEach(req => {
      expect(req.request.method).toEqual('POST');
    });
    requests[0].flush(null, { status: 401, statusText: 'authentication error' });
    requests[1].flush(expectedUserData);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
