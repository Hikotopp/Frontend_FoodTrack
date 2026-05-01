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
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      this.logout();
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }

  hasRole(role: string): boolean {
    return this.getStoredUser()?.role === role;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodePayload(token);
    if (!payload?.exp) {
      return true;
    }
    return payload.exp * 1000 <= Date.now();
  }

  private decodePayload(token: string): { exp?: number } | null {
    const [, encodedPayload] = token.split('.');
    if (!encodedPayload) {
      return null;
    }

    try {
      const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }
}
