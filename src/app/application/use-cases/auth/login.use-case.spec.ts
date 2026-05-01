import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthHttpAdapter } from '../../../infrastructure/adapters/http/auth-http.adapter';
import { LocalStorageAdapter } from '../../../infrastructure/adapters/storage/local-storage.adapter';
import { AuthResponse } from '../../../domain/entities/user.entity';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authHttpMock: jasmine.SpyObj<AuthHttpAdapter>;
  let localStorageMock: jasmine.SpyObj<LocalStorageAdapter>;

  beforeEach(() => {
    authHttpMock = jasmine.createSpyObj('AuthHttpAdapter', ['login']);
    localStorageMock = jasmine.createSpyObj('LocalStorageAdapter', ['saveUser']);

    TestBed.configureTestingModule({
      providers: [
        LoginUseCase,
        { provide: AuthHttpAdapter, useValue: authHttpMock },
        { provide: LocalStorageAdapter, useValue: localStorageMock }
      ]
    });

    useCase = TestBed.inject(LoginUseCase);
  });

  it('should login successfully and save user session', (done) => {
    const response: AuthResponse = {
      token: 'mock-jwt-token',
      fullName: 'Test User',
      email: 'test@example.com',
      role: 'EMPLOYEE'
    };
    authHttpMock.login.and.returnValue(of(response));

    useCase.execute('test@example.com', 'SecurePassword123!').subscribe({
      next: (result) => {
        expect(result).toEqual(response);
        expect(authHttpMock.login).toHaveBeenCalledWith('test@example.com', 'SecurePassword123!');
        expect(localStorageMock.saveUser).toHaveBeenCalledWith({
          fullName: response.fullName,
          email: response.email,
          role: response.role
        }, response.token);
        done();
      },
      error: done.fail
    });
  });

  it('should not save session when login fails', (done) => {
    authHttpMock.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    useCase.execute('test@example.com', 'wrongPassword').subscribe({
      next: () => done.fail('Should have failed'),
      error: (error) => {
        expect(error.message).toBe('Invalid credentials');
        expect(localStorageMock.saveUser).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should preserve admin role returned by the backend', (done) => {
    const response: AuthResponse = {
      token: 'admin-jwt-token',
      fullName: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN'
    };
    authHttpMock.login.and.returnValue(of(response));

    useCase.execute('admin@example.com', 'AdminPassword123!').subscribe({
      next: (result) => {
        expect(result.role).toBe('ADMIN');
        expect(localStorageMock.saveUser).toHaveBeenCalledWith({
          fullName: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN'
        }, 'admin-jwt-token');
        done();
      },
      error: done.fail
    });
  });
});
