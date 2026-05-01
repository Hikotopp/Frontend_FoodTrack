import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthHttpAdapter } from '../../../infrastructure/adapters/http/auth-http.adapter';
import { AuthResponse } from '../../../domain/entities/user.entity';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(private authHttp: AuthHttpAdapter) {}

  execute(fullName: string, email: string, password: string): Observable<AuthResponse> {
    return this.authHttp.register(fullName, email, password);
  }
}
