import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '../../infrastructure/services/session.service';

export const adminGuard: CanActivateFn = () => {
  const sessionService = inject(SessionService);
  const router = inject(Router);

  if (!sessionService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (sessionService.hasRole('ADMIN')) {
    return true;
  }

  router.navigate(['/historial']);
  return false;
};
