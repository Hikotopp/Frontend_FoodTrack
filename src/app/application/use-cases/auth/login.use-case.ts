import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthPort } from '../../../domain/ports/auth.port';
import { SessionPort } from '../../../domain/ports/session.port';
import { AuthResponse } from '../../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(
    private authPort: AuthPort,
    private sessionPort: SessionPort
  ) {}
  execute(email: string, password: string): Observable<AuthResponse> {
    return this.authPort.login(email, password).pipe(
      tap(response => this.sessionPort.saveUser(response.user, response.token))
    );
  }
}