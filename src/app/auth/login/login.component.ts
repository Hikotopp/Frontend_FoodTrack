import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Iniciar sesión</h2>
      <form (ngSubmit)="login()">
        <div>
          <label>Usuario</label>
          <input name="usuario" [(ngModel)]="usuario" required />
        </div>
        <div>
          <label>Contraseña</label>
          <input name="contrasena" type="password" [(ngModel)]="contrasena" required />
        </div>
        <button type="submit">Ingresar</button>
      </form>
      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  `,
  styles: [`
    .login-container { max-width: 360px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
    label { display: block; margin-bottom: 4px; }
    input { width: 100%; padding: 8px; margin-bottom: 12px; }
    .error { color: #c00; }
  `]
})
export class LoginComponent {
  usuario = '';
  contrasena = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.errorMessage = '';
    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: response => {
        this.authService.guardarToken(response.token);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'No se pudo iniciar sesión. Verifica tus credenciales.';
      }
    });
  }
}
