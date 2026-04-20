import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthRepository, LoginResponse, RegisterData } from '../domain/ports/out/auth.repository';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthRepository {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(usuario: string, contrasena: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { usuario, contrasena });
  }

  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, userData);
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

  logout(): void {
    localStorage.removeItem('token');
  }
}