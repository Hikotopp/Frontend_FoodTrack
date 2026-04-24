import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface LoginResponse {
  token: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password
    });
  }

  register(payload: RegisterPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, payload);
  }

  saveSession(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('foodtrack-user', JSON.stringify(response));
  }

  getStoredUser(): LoginResponse | null {
    const rawUser = localStorage.getItem('foodtrack-user');
    return rawUser ? JSON.parse(rawUser) as LoginResponse : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  hasRole(role: UserRole): boolean {
    return this.getStoredUser()?.role === role;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('foodtrack-user');
  }
}
