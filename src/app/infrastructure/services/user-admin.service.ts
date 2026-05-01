import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type AccountRole = 'ADMIN' | 'EMPLOYEE';

export interface UserAccount {
  id: number;
  fullName: string;
  email: string;
  role: AccountRole;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: AccountRole;
}

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private readonly http: HttpClient) {}

  listUsers(): Observable<UserAccount[]> {
    return this.http.get<UserAccount[]>(this.apiUrl);
  }

  createUser(payload: CreateUserPayload): Observable<UserAccount> {
    return this.http.post<UserAccount>(this.apiUrl, payload);
  }

  updateRole(userId: number, role: AccountRole): Observable<UserAccount> {
    return this.http.patch<UserAccount>(`${this.apiUrl}/${userId}/role`, { role });
  }
}
