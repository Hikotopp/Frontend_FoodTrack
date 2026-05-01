import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthRepository, LoginResponse, RegisterData } from '../domain/ports/out/auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthService implements AuthRepository {
  private http = inject(HttpClient);

  login(usuario: string, contrasena: string): Observable<LoginResponse> {
    // TODO: Implement login
    return of({
      token: 'dummy-token',
      role: 'EMPLOYEE',
      fullName: 'Test User',
      email: usuario
    } as LoginResponse);
  }

  register(userData: RegisterData): Observable<any> {
    return of(null);
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  isAuthenticated(): boolean {
    return this.estaAutenticado();
  }

  getUserRole(): string | null {
    return localStorage.getItem('rol') || 'empleado';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }
}