import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [],
  template: `
    <section class="login">
      <div class="marco-login">
        <h1 class="titulo">🍽️ FoodTrack</h1>
        <h2 class="subtitle">Iniciar sesión</h2>
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label>Email</label>
            <input name="usuario" type="email" [(ngModel)]="usuario" required />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input name="contrasena" type="password" [(ngModel)]="contrasena" required />
          </div>
          <div class="acciones">
            <button class="btn continuar" type="submit">Ingresar</button>
          </div>
        </form>
        <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
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
    }
    
    .btn {
      padding: 10px 24px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .continuar {
      background: #27ae60;
      color: white;
    }
    
    .continuar:hover {
      background: #229954;
      transform: translateY(-2px);
    }
    
    .error {
      color: #ff6b6b;
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
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  usuario = '';
  contrasena = '';
  errorMessage = '';

  login(): void {
    this.errorMessage = '';
    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: response => {
        this.authService.guardarToken(response.token);
        localStorage.setItem('rol', response.role);
        this.router.navigate(['/home']);
      },
      error: () => {
        this.errorMessage = 'No se pudo iniciar sesión. Verifica tus credenciales.';
      }
    });
  }
}
