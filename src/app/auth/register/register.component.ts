import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../domain/ports/out/auth.repository';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="login">
      <div class="marco-login">
        <h1 class="titulo">🍽️ FoodTrack</h1>
        <h2 class="subtitle">Crear cuenta</h2>
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
            <a routerLink="/login" class="btn cancelar">Cancelar</a>
          </div>
        </form>
        <p *ngIf="message" class="message">{{ message }}</p>
      </div>
    </section>
  `,
  styles: [`
    .login {
      width: 100vw;
      height: 100vh;
      background-image: url('/assets/fondo.png');
      background-size: cover;
      background-position: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .login::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      top: 0;
      left: 0;
      z-index: 0;
    }
    
    .marco-login {
      background: rgba(120, 0, 0, 0.20);
      padding: 50px 70px;
      text-align: center;
      border: 2px solid #caa15a;
      backdrop-filter: blur(8px);
      position: relative;
      z-index: 2;
      width: 400px;
      max-height: 90vh;
      overflow-y: auto;
      clip-path: polygon(
        20px 0%, 
        calc(100% - 20px) 0%, 
        100% 20px, 
        100% calc(100% - 20px), 
        calc(100% - 20px) 100%, 
        20px 100%, 
        0% calc(100% - 20px), 
        0% 20px
      );
      animation: fadeIn 0.8s ease;
    }
    
    .titulo {
      font-family: "Playfair Display", serif;
      font-size: 32px;
      color: #f5d7a1;
      margin-bottom: 8px;
      letter-spacing: 3px;
    }
    
    .subtitle {
      font-size: 16px;
      color: #caa15a;
      margin-bottom: 30px;
      letter-spacing: 1px;
      font-weight: 400;
    }
    
    .form-group {
      margin-bottom: 20px;
      text-align: left;
    }
    
    .form-group label {
      color: #f5d7a1;
      font-size: 14px;
      display: block;
      margin-bottom: 8px;
    }
    
    .form-group input {
      width: 100%;
      padding: 10px;
      border-radius: 20px;
      border: none;
      outline: none;
      box-sizing: border-box;
    }
    
    .acciones {
      margin-top: 30px;
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 10px 24px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }
    
    .gold {
      background: #caa15a;
      color: white;
    }
    
    .gold:hover {
      background: #d4b896;
      transform: translateY(-2px);
    }
    
    .cancelar {
      background: #c0392b;
      color: white;
    }
    
    .cancelar:hover {
      background: #a93226;
      transform: translateY(-2px);
    }
    
    .message {
      color: #f5d7a1;
      margin-top: 16px;
      font-size: 14px;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
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
