import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthPort } from '../../../domain/ports/auth.port';
import { AuthResponse } from '../../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(private authPort: AuthPort) {}
  execute(fullName: string, email: string, password: string): Observable<AuthResponse> {
    return this.authPort.register(fullName, email, password);
  }
}