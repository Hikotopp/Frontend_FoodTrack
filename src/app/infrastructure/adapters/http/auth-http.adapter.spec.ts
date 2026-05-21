import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthHttpAdapter } from './auth-http.adapter';
import { environment } from '../../../../environments/environment';

describe('AuthHttpAdapter', () => {
  let adapter: AuthHttpAdapter;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthHttpAdapter]
    });

    adapter = TestBed.inject(AuthHttpAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends login credentials to the auth API', () => {
    adapter.login('user@example.com', 'Secret123!').subscribe(response => {
      expect(response.token).toBe('jwt-token');
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'user@example.com', password: 'Secret123!' });
    request.flush({ token: 'jwt-token', fullName: 'User', email: 'user@example.com', role: 'EMPLOYEE' });
  });

  it('sends registration data to the auth API', () => {
    adapter.register('New User', 'new@example.com', 'Secret123!').subscribe(response => {
      expect(response.email).toBe('new@example.com');
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      fullName: 'New User',
      email: 'new@example.com',
      password: 'Secret123!'
    });
    request.flush({ token: 'jwt-token', fullName: 'New User', email: 'new@example.com', role: 'EMPLOYEE' });
  });
});
