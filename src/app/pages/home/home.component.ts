import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  template: `
    <section class="home-page">
      <h1 class="page-title">FoodTrack</h1>
      <p>Bienvenido a la plataforma de gestión de pedidos.</p>
      <nav>
        <a routerLink="/mesas">Ver mesas</a>
        <a routerLink="/login">Cerrar sesión</a>
      </nav>
    </section>
  `,
  styles: [`
    .home-page { max-width: 720px; margin: 40px auto; padding: 24px; }
    .page-title { margin-bottom: 12px; }
    nav a { margin-right: 16px; }
  `]
})
export class HomeComponent {}
