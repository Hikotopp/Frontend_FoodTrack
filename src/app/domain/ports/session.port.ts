import { User } from '../entities/user.entity';

export interface SessionPort {
  saveUser(user: User, token: string): void;
  getUser(): User | null;
  getToken(): string | null;
  isAuthenticated(): boolean;
  logout(): void;
}