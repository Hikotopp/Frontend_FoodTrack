import { TestBed } from '@angular/core/testing';
import { LoginUseCase } from './login.use-case';
import { AuthPort } from '../../../../domain/ports/auth.port';
import { SessionPort } from '../../../../domain/ports/session.port';
import { AuthResponse } from '../../../../domain/entities/user.entity';
import { UserRole } from '../../../../domain/entities/user.entity';
import { of, throwError } from 'rxjs';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let authPortMock: jasmine.SpyObj<AuthPort>;
  let sessionPortMock: jasmine.SpyObj<SessionPort>;

  beforeEach(() => {
    // Mock interfaces
    authPortMock = jasmine.createSpyObj('AuthPort', ['login', 'register']);
    sessionPortMock = jasmine.createSpyObj('SessionPort', ['saveUser', 'getUser', 'getToken', 'isAuthenticated', 'logout']);

    TestBed.configureTestingModule({
      providers: [
        LoginUseCase,
        { provide: AuthPort, useValue: authPortMock },
        { provide: SessionPort, useValue: sessionPortMock }
      ]
    });

    useCase = TestBed.inject(LoginUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  describe('execute', () => {
    it('should login successfully and save user session', (done) => {
      // Arrange
      const email = 'test@example.com';
      const password = 'SecurePassword123!';
      const mockToken = 'mock-jwt-token';
      const mockUser = {
        fullName: 'Test User',
        email: email,
        role: 'EMPLOYEE' as UserRole
      };
      const mockResponse: AuthResponse = {
        token: mockToken,
        user: mockUser
      };

      authPortMock.login.and.returnValue(of(mockResponse));

      // Act
      useCase.execute(email, password).subscribe({
        next: (result) => {
          // Assert
          expect(result).toEqual(mockResponse);
          expect(authPortMock.login).toHaveBeenCalledWith(email, password);
          expect(sessionPortMock.saveUser).toHaveBeenCalledWith(mockUser, mockToken);
          done();
        },
        error: done.fail
      });
    });

    it('should propagate login error', (done) => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const errorMessage = 'Invalid credentials';

      authPortMock.login.and.returnValue(throwError(() => new Error(errorMessage)));

      // Act
      useCase.execute(email, password).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          expect(sessionPortMock.saveUser).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should handle admin users', (done) => {
      // Arrange
      const email = 'admin@example.com';
      const password = 'AdminPassword123!';
      const mockToken = 'admin-jwt-token';
      const mockAdminUser = {
        fullName: 'Admin User',
        email: email,
        role: 'ADMIN' as UserRole
      };
      const mockResponse: AuthResponse = {
        token: mockToken,
        user: mockAdminUser
      };

      authPortMock.login.and.returnValue(of(mockResponse));

      // Act
      useCase.execute(email, password).subscribe({
        next: (result) => {
          // Assert
          expect(result.user.role).toBe('ADMIN');
          expect(sessionPortMock.saveUser).toHaveBeenCalledWith(mockAdminUser, mockToken);
          done();
        },
        error: done.fail
      });
    });

    it('should save user session on successful login', (done) => {
      // Arrange
      const email = 'test@example.com';
      const password = 'SecurePassword123!';
      const mockToken = 'mock-jwt-token';
      const mockUser = {
        fullName: 'Test User',
        email: email,
        role: 'EMPLOYEE' as UserRole
      };
      const mockResponse: AuthResponse = {
        token: mockToken,
        user: mockUser
      };

      authPortMock.login.and.returnValue(of(mockResponse));

      // Act
      useCase.execute(email, password).subscribe({
        next: () => {
          // Assert
          expect(sessionPortMock.saveUser).toHaveBeenCalledTimes(1);
          expect(sessionPortMock.saveUser).toHaveBeenCalledWith(mockUser, mockToken);
          done();
        },
        error: done.fail
      });
    });

    it('should not save session when login fails', (done) => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongPassword';

      authPortMock.login.and.returnValue(throwError(() => new Error('Login failed')));

      // Act
      useCase.execute(email, password).subscribe({
        next: () => done.fail('Should have failed'),
        error: () => {
          // Assert
          expect(sessionPortMock.saveUser).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should handle empty credentials', (done) => {
      // Arrange
      const email = '';
      const password = '';

      authPortMock.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

      // Act
      useCase.execute(email, password).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error).toBeTruthy();
          done();
        }
      });
    });
  });
});
