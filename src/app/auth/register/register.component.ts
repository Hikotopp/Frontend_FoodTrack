import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../domain/ports/out/auth.repository';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container register-container">
      <h1 class="page-title">FoodTrack</h1>
      <h2>Crear cuenta</h2>
      <form (ngSubmit)="register()">
        <div class="form-group">
          <label>Usuario</label>
          <input name="username" [(ngModel)]="form.username" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input name="email" type="email" [(ngModel)]="form.email" required />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input name="contrasena" type="password" [(ngModel)]="form.contrasena" required />
        </div>
        <div class="form-group">
          <label>Rol</label>
          <input name="rol" [(ngModel)]="form.rol" />
        </div>
        <div class="acciones">
          <button class="btn gold" type="submit">Registrarse</button>
        </div>
      </form>
      <p *ngIf="message" class="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .login-container { max-width: 360px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: rgba(0,0,0,0.35); }
    .page-title { margin-bottom: 12px; }
    .form-group { margin-bottom: 20px; text-align: left; }
    .form-group label { color: #f5d7a1; font-size: 14px; }
    .form-group input { width: 100%; padding: 10px; border-radius: 20px; border: none; margin-top: 5px; outline: none; }
    .acciones { margin-top: 30px; display: flex; justify-content: center; gap: 15px; }
    .message { color: #f5d7a1; margin-top: 20px; }
  `]
})
export class RegisterComponent {
  form: RegisterData = { username: '', email: '', contrasena: '', rol: '' };
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    this.message = '';
    this.authService.register(this.form).subscribe({
      next: () => {
        this.message = 'Registro exitoso. Por favor inicia sesión.';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: () => {
        this.message = 'Error al registrar. Intenta de nuevo.';
      }
    });
  }
}
