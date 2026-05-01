import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, retry, throwError, timer } from 'rxjs';
import { SessionService } from '../../infrastructure/services/session.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(SessionService);
  const router = inject(Router);
  const token = session.getToken();

  const isProtected = request.url.includes('/api/') && !request.url.includes('/api/auth/');

  let authReq = request;
  if (isProtected && token) {
    authReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    retry({
      count: 1,
      delay: (error) => (error.status === 0 ? timer(1000) : throwError(() => error))
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        session.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};