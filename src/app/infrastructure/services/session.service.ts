import { Injectable } from '@angular/core';

export interface StoredUser {
  fullName: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'foodtrack-user';

  saveSession(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    const userInfo: StoredUser = {
      fullName: response.fullName,
      email: response.email,
      role: response.role
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
  }

  getStoredUser(): StoredUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  hasRole(role: string): boolean {
    return this.getStoredUser()?.role === role;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}