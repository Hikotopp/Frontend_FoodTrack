import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthPort } from '../../../domain/ports/auth.port';
import { AuthResponse } from '../../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class AuthHttpAdapter implements AuthPort {
  private apiUrl = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password });
  }
  register(fullName: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { fullName, email, password });
  }
}
