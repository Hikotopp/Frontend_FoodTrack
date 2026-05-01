import { Observable } from 'rxjs';
import { AuthResponse } from '../entities/user.entity';

export interface AuthPort {
  login(email: string, password: string): Observable<AuthResponse>;
  register(fullName: string, email: string, password: string): Observable<AuthResponse>;
}