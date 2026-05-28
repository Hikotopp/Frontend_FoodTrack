import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { throwError, of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { SessionService } from '../../infrastructure/services/session.service';

describe('authInterceptor', () => {
  let sessionService: jasmine.SpyObj<SessionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    sessionService = jasmine.createSpyObj<SessionService>('SessionService', ['getToken', 'logout']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('adds authorization header to protected API requests', (done) => {
    sessionService.getToken.and.returnValue('jwt-token');
    const request = new HttpRequest('GET', '/api/tables');

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, (nextRequest) => {
        expect(nextRequest.headers.get('Authorization')).toBe('Bearer jwt-token');
        return of({} as any);
      }).subscribe(() => done());
    });
  });

  it('does not add authorization header to login requests', (done) => {
    sessionService.getToken.and.returnValue('jwt-token');
    const request = new HttpRequest('POST', '/api/auth/login', {});

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, (nextRequest) => {
        expect(nextRequest.headers.has('Authorization')).toBeFalse();
        return of({} as any);
      }).subscribe(() => done());
    });
  });

  it('logs out and redirects when the API returns unauthorized', (done) => {
    sessionService.getToken.and.returnValue('jwt-token');
    const request = new HttpRequest('GET', '/api/tables');
    const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, () => throwError(() => error)).subscribe({
        error: (receivedError) => {
          expect(receivedError).toBe(error);
          expect(sessionService.logout).toHaveBeenCalled();
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        }
      });
    });
  });
});
