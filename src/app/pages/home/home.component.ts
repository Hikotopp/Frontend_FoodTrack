import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <section class="home-page">
      <div class="home-container">
        <div class="welcome-box">
          <h1 class="page-title">🍽️ FoodTrack</h1>
          <p class="subtitle">Bienvenido a la plataforma de gestión de pedidos</p>
          
          <div class="features">
            <div class="feature-item">
              <span class="feature-icon">📋</span>
              <p>Gestión de mesas</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🛒</span>
              <p>Pedidos en tiempo real</p>
            </div>
            <div class="feature-item">
              <span class="feature-icon">💰</span>
              <p>Facturación integrada</p>
            </div>
          </div>
          
          <nav class="nav-buttons">
            <ng-container *ngIf="!isAuthenticated(); else loggedIn">
              <a routerLink="/register" class="btn-primary">📝 Registrarse</a>
              <a routerLink="/login" class="btn-secondary">🔓 Iniciar sesión</a>
            </ng-container>
            
            <ng-template #loggedIn>
              <a routerLink="/mesas" class="btn-primary">📊 Ver mesas</a>
              <button (click)="logout()" class="btn-logout">🚪 Cerrar sesión</button>
            </ng-template>
          </nav>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .home-page {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 20px;
    }
    
    .home-container {
      width: 100%;
      max-width: 800px;
    }
    
    .welcome-box {
      background: rgba(202, 161, 90, 0.05);
      border: 2px solid #caa15a;
      border-radius: 16px;
      padding: 60px 40px;
      text-align: center;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(202, 161, 90, 0.1);
      animation: slideIn 0.6s ease-out;
    }
    
    .page-title {
      font-size: 48px;
      font-family: "Playfair Display", serif;
      color: #f5d7a1;
      letter-spacing: 3px;
      margin-bottom: 12px;
      font-weight: 600;
    }
    
    .subtitle {
      font-size: 16px;
      color: #caa15a;
      margin-bottom: 40px;
      letter-spacing: 1px;
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .feature-item {
      padding: 20px;
      background: rgba(202, 161, 90, 0.1);
      border-radius: 12px;
      border: 1px solid rgba(202, 161, 90, 0.3);
      transition: all 0.3s ease;
    }
    
    .feature-item:hover {
      transform: translateY(-5px);
      background: rgba(202, 161, 90, 0.15);
      border-color: #caa15a;
    }
    
    .feature-icon {
      font-size: 32px;
      display: block;
      margin-bottom: 10px;
    }
    
    .feature-item p {
      color: #f5d7a1;
      font-size: 14px;
      margin: 0;
    }
    
    .nav-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    a[routerLink], .btn-logout {
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-block;
      letter-spacing: 1px;
      border: 2px solid transparent;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #caa15a 0%, #d4b896 100%);
      color: #1a1a2e;
      border-color: #caa15a;
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(202, 161, 90, 0.3);
      background: linear-gradient(135deg, #d4b896 0%, #caa15a 100%);
    }
    
    .btn-secondary {
      background: transparent;
      color: #caa15a;
      border: 2px solid #caa15a;
    }
    
    .btn-secondary:hover {
      background: rgba(202, 161, 90, 0.1);
      transform: translateY(-2px);
    }
    
    .btn-logout {
      background: transparent;
      color: #ff6b6b;
      border: 2px solid #ff6b6b;
    }
    
    .btn-logout:hover {
      background: rgba(255, 107, 107, 0.1);
      transform: translateY(-2px);
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class HomeComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
