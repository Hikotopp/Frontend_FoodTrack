import { TestBed } from '@angular/core/testing';
import { RegisterUseCase } from './register.use-case';
import { AuthPort } from '../../../../domain/ports/auth.port';
import { AuthResponse } from '../../../../domain/entities/user.entity';
import { UserRole } from '../../../../domain/entities/user.entity';
import { of, throwError } from 'rxjs';

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let authPortMock: jasmine.SpyObj<AuthPort>;

  beforeEach(() => {
    authPortMock = jasmine.createSpyObj('AuthPort', ['login', 'register']);

    TestBed.configureTestingModule({
      providers: [
        RegisterUseCase,
        { provide: AuthPort, useValue: authPortMock }
      ]
    });

    useCase = TestBed.inject(RegisterUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  describe('execute', () => {
    it('should register a new user successfully', (done) => {
      // Arrange
      const fullName = 'New User';
      const email = 'newuser@example.com';
      const password = 'SecurePassword123!';
      const mockToken = 'new-jwt-token';
      const mockUser = {
        fullName: fullName,
        email: email,
        role: 'EMPLOYEE' as UserRole
      };
      const mockResponse: AuthResponse = {
        token: mockToken,
        user: mockUser
      };

      authPortMock.register.and.returnValue(of(mockResponse));

      // Act
      useCase.execute(fullName, email, password).subscribe({
        next: (result) => {
          // Assert
          expect(result).toEqual(mockResponse);
          expect(authPortMock.register).toHaveBeenCalledWith(fullName, email, password);
          done();
        },
        error: done.fail
      });
    });

    it('should handle registration error when email already exists', (done) => {
      // Arrange
      const fullName = 'Existing User';
      const email = 'existing@example.com';
      const password = 'SecurePassword123!';
      const errorMessage = 'Email is already registered';

      authPortMock.register.and.returnValue(throwError(() => new Error(errorMessage)));

      // Act
      useCase.execute(fullName, email, password).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error.message).toBe(errorMessage);
          done();
        }
      });
    });

    it('should validate all required fields', (done) => {
      // Arrange
      const email = 'test@example.com';
      const password = 'SecurePassword123!';

      authPortMock.register.and.returnValue(throwError(() => new Error('Missing full name')));

      // Act
      useCase.execute('', email, password).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error).toBeTruthy();
          done();
        }
      });
    });

    it('should handle invalid email format', (done) => {
      // Arrange
      const fullName = 'Test User';
      const email = 'invalid-email';
      const password = 'SecurePassword123!';

      authPortMock.register.and.returnValue(throwError(() => new Error('Invalid email format')));

      // Act
      useCase.execute(fullName, email, password).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error.message).toBe('Invalid email format');
          done();
        }
      });
    });

    it('should handle weak password error', (done) => {
      // Arrange
      const fullName = 'Test User';
      const email = 'test@example.com';
      const weakPassword = '123';

      authPortMock.register.and.returnValue(throwError(() => new Error('Password too weak')));

      // Act
      useCase.execute(fullName, email, weakPassword).subscribe({
        next: () => done.fail('Should have failed'),
        error: (error) => {
          // Assert
          expect(error.message).toBe('Password too weak');
          done();
        }
      });
    });

    it('should successfully register with valid data', (done) => {
      // Arrange
      const fullName = 'Valid User';
      const email = 'valid@example.com';
      const password = 'ValidPassword123!';
      const mockToken = 'valid-token';
      const mockResponse: AuthResponse = {
        token: mockToken,
        user: {
          fullName: fullName,
          email: email,
          role: 'EMPLOYEE' as UserRole
        }
      };

      authPortMock.register.and.returnValue(of(mockResponse));

      // Act
      useCase.execute(fullName, email, password).subscribe({
        next: (result) => {
          // Assert
          expect(result.token).toBe(mockToken);
          expect(result.user.fullName).toBe(fullName);
          expect(result.user.email).toBe(email);
          done();
        },
        error: done.fail
      });
    });
  });
});
