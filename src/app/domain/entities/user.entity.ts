export type UserRole = 'ADMIN' | 'EMPLOYEE';

export interface User {
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  role: UserRole;
}
