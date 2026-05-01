import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthHttpAdapter } from '../../../infrastructure/adapters/http/auth-http.adapter';
import { LocalStorageAdapter } from '../../../infrastructure/adapters/storage/local-storage.adapter';
import { AuthResponse } from '../../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(
    private authHttp: AuthHttpAdapter,
    private localStorage: LocalStorageAdapter
  ) {}

  execute(email: string, password: string): Observable<AuthResponse> {
    return this.authHttp.login(email, password).pipe(
      tap(response => this.localStorage.saveUser({
        fullName: response.fullName,
        email: response.email,
        role: response.role
      }, response.token))
    );
  }
}
