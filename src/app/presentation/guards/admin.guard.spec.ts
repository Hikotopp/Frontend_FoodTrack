import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import { SessionService } from '../../infrastructure/services/session.service';

describe('adminGuard', () => {
  let sessionService: jasmine.SpyObj<SessionService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    sessionService = jasmine.createSpyObj<SessionService>('SessionService', ['isAuthenticated', 'hasRole']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router }
      ]
    });
  });

  it('redirects anonymous users to login', () => {
    sessionService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(sessionService.hasRole).not.toHaveBeenCalled();
  });

  it('allows admin users', () => {
    sessionService.isAuthenticated.and.returnValue(true);
    sessionService.hasRole.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));

    expect(result).toBeTrue();
    expect(sessionService.hasRole).toHaveBeenCalledWith('ADMIN');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('redirects non-admin users to history', () => {
    sessionService.isAuthenticated.and.returnValue(true);
    sessionService.hasRole.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/historial']);
  });
});
