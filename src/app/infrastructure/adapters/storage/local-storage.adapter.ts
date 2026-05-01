import { Injectable } from '@angular/core';
import { SessionPort } from '../../../domain/ports/session.port';
import { User } from '../../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class LocalStorageAdapter implements SessionPort {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'foodtrack-user';

  saveUser(user: User, token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
  getUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}