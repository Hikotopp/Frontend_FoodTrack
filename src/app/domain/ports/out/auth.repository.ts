import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  tipoUsuario: string;
  nombre: string;
  usuario: string;
}

export interface RegisterData {
  username: string;
  email: string;
  contrasena: string;
  rol: string;
}

export interface AuthRepository {
  login(usuario: string, contrasena: string): Observable<LoginResponse>;
  register(userData: RegisterData): Observable<any>;
}
