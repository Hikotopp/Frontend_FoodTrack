import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from './session.service';
import { StoredUser } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  let store: { [key: string]: string } = {};

  const createToken = (expirationInSeconds: number): string => {
    const payload = btoa(JSON.stringify({ exp: expirationInSeconds }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return `header.${payload}.signature`;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService]
    });

    service = TestBed.inject(SessionService);

    // Mock localStorage
    store = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });
  });

  describe('saveSession', () => {
    it('should save token and user info to localStorage', () => {
      // Arrange
      const mockResponse = {
        token: 'mock-jwt-token',
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      };

      // Act
      service.saveSession(mockResponse);

      // Assert
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'foodtrack-user',
        JSON.stringify({
          fullName: 'Test User',
          email: 'test@example.com',
          role: 'EMPLOYEE'
        })
      );
    });

    it('should store user data correctly', () => {
      // Arrange
      const mockResponse = {
        token: 'token123',
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'ADMIN'
      };

      // Act
      service.saveSession(mockResponse);

      // Assert
      const storedUser = JSON.parse(store['foodtrack-user']);
      expect(storedUser.fullName).toBe('John Doe');
      expect(storedUser.email).toBe('john@example.com');
      expect(storedUser.role).toBe('ADMIN');
    });
  });

  describe('getStoredUser', () => {
    it('should return null when no user is stored', () => {
      // Act
      const user = service.getStoredUser();

      // Assert
      expect(user).toBeNull();
    });

    it('should return stored user data', () => {
      // Arrange
      const mockUser: StoredUser = {
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'EMPLOYEE'
      };
      store['foodtrack-user'] = JSON.stringify(mockUser);

      // Act
      const user = service.getStoredUser();

      // Assert
      expect(user).toEqual(mockUser);
    });

    it('should handle malformed JSON gracefully', () => {
      // Arrange
      store['foodtrack-user'] = 'invalid-json';

      // Act & Assert
      expect(() => service.getStoredUser()).not.toThrow();
    });
  });

  describe('getToken', () => {
    it('should return null when no token is stored', () => {
      // Act
      const token = service.getToken();

      // Assert
      expect(token).toBeNull();
    });

    it('should return stored token', () => {
      // Arrange
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      store['token'] = mockToken;

      // Act
      const token = service.getToken();

      // Assert
      expect(token).toBe(mockToken);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token is stored', () => {
      // Act
      const isAuth = service.isAuthenticated();

      // Assert
      expect(isAuth).toBeFalsy();
    });

    it('should return true when a non-expired token is stored', () => {
      // Arrange
      store['token'] = createToken(Math.floor(Date.now() / 1000) + 3600);

      // Act
      const isAuth = service.isAuthenticated();

      // Assert
      expect(isAuth).toBeTruthy();
    });

    it('should clear the session when token is expired', () => {
      // Arrange
      store['token'] = createToken(Math.floor(Date.now() / 1000) - 60);
      store['foodtrack-user'] = JSON.stringify({ fullName: 'User', email: 'user@example.com', role: 'EMPLOYEE' });

      // Act
      const isAuth = service.isAuthenticated();

      // Assert
      expect(isAuth).toBeFalsy();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('foodtrack-user');
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the specified role', () => {
      // Arrange
      const mockUser: StoredUser = {
        fullName: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN'
      };
      store['foodtrack-user'] = JSON.stringify(mockUser);

      // Act
      const hasRole = service.hasRole('ADMIN');

      // Assert
      expect(hasRole).toBeTruthy();
    });

    it('should return false when user does not have the specified role', () => {
      // Arrange
      const mockUser: StoredUser = {
        fullName: 'Employee User',
        email: 'employee@example.com',
        role: 'EMPLOYEE'
      };
      store['foodtrack-user'] = JSON.stringify(mockUser);

      // Act
      const hasRole = service.hasRole('ADMIN');

      // Assert
      expect(hasRole).toBeFalsy();
    });

    it('should return false when no user is stored', () => {
      // Act
      const hasRole = service.hasRole('ADMIN');

      // Assert
      expect(hasRole).toBeFalsy();
    });
  });

  describe('logout', () => {
    it('should clear token and user data from localStorage', () => {
      // Arrange
      store['token'] = 'mock-token';
      store['foodtrack-user'] = JSON.stringify({ fullName: 'User', email: 'user@example.com', role: 'EMPLOYEE' });

      // Act
      service.logout();

      // Assert
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('foodtrack-user');
      expect(service.isAuthenticated()).toBeFalsy();
      expect(service.getStoredUser()).toBeNull();
    });

    it('should handle logout when no session exists', () => {
      // Act & Assert
      expect(() => service.logout()).not.toThrow();
    });
  });
});
