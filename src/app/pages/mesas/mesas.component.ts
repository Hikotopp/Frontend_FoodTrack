import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PedidoUseCaseService } from '../../application/services/pedido.use-case.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule],
  template: `
    <section class="mesas-page">
      <div class="mesas-container">
        <div class="mesas-header">
          <h1 class="page-title">📋 Pedidos</h1>
          <p class="subtitle">Gestión de pedidos en tiempo real</p>
          <div class="user-info">
            <span *ngIf="userRole">👤 {{ userRole === 'admin' ? 'Administrador' : 'Empleado' }}</span>
          </div>
        </div>
        
        <div class="mesas-box">
          <div class="admin-actions" *ngIf="isAdmin()">
            <h3>Acciones de Administrador</h3>
            <div class="action-buttons">
              <button class="btn-action btn-add">➕ Agregar mesa</button>
              <button class="btn-action btn-edit">✏️ Editar mesas</button>
              <button class="btn-action btn-delete">❌ Eliminar mesa</button>
            </div>
          </div>
          
          <div class="pedidos-content">
            <div *ngIf="pedidos$ | async as pedidos; else loading" class="pedidos-list">
              <div class="no-pedidos" *ngIf="pedidos.length === 0">
                <span class="empty-icon">🛒</span>
                <p>No hay pedidos registrados</p>
              </div>
              
              <div class="pedido-item" *ngFor="let pedido of pedidos">
                <div class="pedido-header">
                  <span class="pedido-id">Pedido #{{ pedido.id }}</span>
                  <span class="estado-badge" [class]="'estado-' + pedido.estado?.toLowerCase()">
                    {{ pedido.estado }}
                  </span>
                </div>
                <div class="pedido-details">
                  <span class="mesa-info">🪑 Mesa {{ pedido.mesaId }}</span>
                </div>
                
                <div class="pedido-actions">
                  <button class="btn-small" title="Cambiar estado">📊</button>
                  <button class="btn-small" title="Gestionar productos">🛒</button>
                  <button class="btn-small btn-delete-item" *ngIf="isAdmin()" title="Eliminar pedido">🗑️</button>
                </div>
              </div>
            </div>
            
            <ng-template #loading>
              <div class="loading-state">
                <span class="loading-spinner"></span>
                <p>Cargando pedidos...</p>
              </div>
            </ng-template>
          </div>
          
          <nav class="nav-buttons">
            <a routerLink="/home" class="btn-secondary">⬅️ Volver</a>
            <button (click)="logout()" class="btn-logout">🚪 Cerrar sesión</button>
          </nav>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .mesas-page {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 20px;
    }
    
    .mesas-container {
      width: 100%;
      max-width: 900px;
    }
    
    .mesas-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .page-title {
      font-size: 48px;
      font-family: "Playfair Display", serif;
      color: #f5d7a1;
      letter-spacing: 3px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .subtitle {
      font-size: 16px;
      color: #caa15a;
      margin-bottom: 12px;
      letter-spacing: 1px;
    }
    
    .user-info {
      font-size: 14px;
      color: #caa15a;
      font-style: italic;
    }
    
    .mesas-box {
      background: rgba(202, 161, 90, 0.05);
      border: 2px solid #caa15a;
      border-radius: 16px;
      padding: 40px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(202, 161, 90, 0.1);
      animation: slideIn 0.6s ease-out;
    }
    
    .admin-actions {
      background: rgba(202, 161, 90, 0.15);
      border: 1px solid rgba(202, 161, 90, 0.5);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .admin-actions h3 {
      color: #caa15a;
      font-size: 16px;
      margin-bottom: 15px;
      letter-spacing: 1px;
    }
    
    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .btn-action {
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s ease;
      color: white;
    }
    
    .btn-add {
      background: #27ae60;
    }
    
    .btn-add:hover {
      background: #229954;
      transform: translateY(-2px);
    }
    
    .btn-edit {
      background: #2196f3;
    }
    
    .btn-edit:hover {
      background: #0b7dda;
      transform: translateY(-2px);
    }
    
    .btn-delete {
      background: #c0392b;
    }
    
    .btn-delete:hover {
      background: #a93226;
      transform: translateY(-2px);
    }
    
    .pedidos-content {
      min-height: 200px;
      margin-bottom: 30px;
    }
    
    .pedidos-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .no-pedidos {
      text-align: center;
      padding: 40px 20px;
      color: #caa15a;
    }
    
    .empty-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 12px;
    }
    
    .pedido-item {
      background: rgba(202, 161, 90, 0.1);
      border: 1px solid rgba(202, 161, 90, 0.3);
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s ease;
    }
    
    .pedido-item:hover {
      background: rgba(202, 161, 90, 0.15);
      border-color: #caa15a;
    }
    
    .pedido-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .pedido-id {
      color: #f5d7a1;
      font-weight: 600;
      font-size: 16px;
    }
    
    .estado-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
    }
    
    .estado-pendiente {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
    }
    
    .estado-en-progreso {
      background: rgba(33, 150, 243, 0.2);
      color: #2196f3;
    }
    
    .estado-completado {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
    }
    
    .pedido-details {
      color: #caa15a;
      font-size: 14px;
      margin-bottom: 12px;
    }
    
    .mesa-info {
      display: inline-block;
    }
    
    .pedido-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }
    
    .btn-small {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid rgba(202, 161, 90, 0.5);
      background: rgba(202, 161, 90, 0.1);
      color: #caa15a;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
    }
    
    .btn-small:hover {
      background: rgba(202, 161, 90, 0.2);
      border-color: #caa15a;
    }
    
    .btn-small.btn-delete-item {
      background: rgba(255, 107, 107, 0.1);
      border-color: rgba(255, 107, 107, 0.5);
      color: #ff6b6b;
    }
    
    .btn-small.btn-delete-item:hover {
      background: rgba(255, 107, 107, 0.2);
      border-color: #ff6b6b;
    }
    
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #caa15a;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(202, 161, 90, 0.3);
      border-top: 3px solid #caa15a;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 12px;
    }
    
    .nav-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
    
    a[routerLink], .btn-logout {
      padding: 12px 28px;
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
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class MesasComponent implements OnInit {
  pedidos$ = this.pedidoUseCase.listar();
  userRole: string | null = null;

  constructor(
    private pedidoUseCase: PedidoUseCaseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
