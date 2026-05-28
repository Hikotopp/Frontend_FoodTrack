import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, RegisterPayload } from './auth.service';
import { SessionService, LoginResponse } from './session.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let sessionService: jasmine.SpyObj<SessionService>;
  const apiUrl = environment.apiUrl;

  const response: LoginResponse = {
    token: 'jwt-token',
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN'
  };

  beforeEach(() => {
    sessionService = jasmine.createSpyObj<SessionService>('SessionService', ['saveSession']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: SessionService, useValue: sessionService }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('logs in and stores the returned session', () => {
    service.login('admin@example.com', 'Secret123!').subscribe((loginResponse) => {
      expect(loginResponse).toEqual(response);
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@example.com', password: 'Secret123!' });
    req.flush(response);

    expect(sessionService.saveSession).toHaveBeenCalledWith(response);
  });

  it('registers a new user', () => {
    const payload: RegisterPayload = {
      fullName: 'New User',
      email: 'new@example.com',
      password: 'Secret123!'
    };

    service.register(payload).subscribe((registerResponse) => {
      expect(registerResponse.email).toBe('admin@example.com');
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(response);
  });
});
