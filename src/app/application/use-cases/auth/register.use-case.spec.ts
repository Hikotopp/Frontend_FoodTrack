import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthHttpAdapter } from '../../../infrastructure/adapters/http/auth-http.adapter';
import { AuthResponse } from '../../../domain/entities/user.entity';
import { RegisterUseCase } from './register.use-case';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let authHttpMock: jasmine.SpyObj<AuthHttpAdapter>;

  beforeEach(() => {
    authHttpMock = jasmine.createSpyObj('AuthHttpAdapter', ['register']);

    TestBed.configureTestingModule({
      providers: [
        RegisterUseCase,
        { provide: AuthHttpAdapter, useValue: authHttpMock }
      ]
    });

    useCase = TestBed.inject(RegisterUseCase);
  });

  it('should register a new user successfully', (done) => {
    const response: AuthResponse = {
      token: 'new-jwt-token',
      fullName: 'New User',
      email: 'newuser@example.com',
      role: 'EMPLOYEE'
    };
    authHttpMock.register.and.returnValue(of(response));

    useCase.execute('New User', 'newuser@example.com', 'SecurePassword123!').subscribe({
      next: (result) => {
        expect(result).toEqual(response);
        expect(authHttpMock.register).toHaveBeenCalledWith('New User', 'newuser@example.com', 'SecurePassword123!');
        done();
      },
      error: done.fail
    });
  });

  it('should propagate backend registration errors', (done) => {
    authHttpMock.register.and.returnValue(throwError(() => new Error('Email is already registered')));

    useCase.execute('Existing User', 'existing@example.com', 'SecurePassword123!').subscribe({
      next: () => done.fail('Should have failed'),
      error: (error) => {
        expect(error.message).toBe('Email is already registered');
        done();
      }
    });
  });

  it('should return the normalized backend response shape', (done) => {
    const response: AuthResponse = {
      token: 'valid-token',
      fullName: 'Valid User',
      email: 'valid@example.com',
      role: 'EMPLOYEE'
    };
    authHttpMock.register.and.returnValue(of(response));

    useCase.execute('Valid User', 'valid@example.com', 'ValidPassword123!').subscribe({
      next: (result) => {
        expect(result.token).toBe('valid-token');
        expect(result.fullName).toBe('Valid User');
        expect(result.email).toBe('valid@example.com');
        expect(result.role).toBe('EMPLOYEE');
        done();
      },
      error: done.fail
    });
  });
});
