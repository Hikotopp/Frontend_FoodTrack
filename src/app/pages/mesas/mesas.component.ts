import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { PedidoUseCaseService } from '../../application/services/pedido.use-case.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  template: `
    <section class="mesas-page">
      <h2>Pedidos</h2>
      <ul *ngIf="pedidos$ | async as pedidos; else loading">
        <li *ngFor="let pedido of pedidos">
          Pedido #{{ pedido.id }} - Mesa {{ pedido.mesaId }} - Estado: {{ pedido.estado }}
        </li>
      </ul>
      <ng-template #loading>
        <p>Cargando pedidos...</p>
      </ng-template>
    </section>
  `,
  styles: [`
    .mesas-page { max-width: 720px; margin: 40px auto; padding: 24px; }
    ul { list-style: none; padding: 0; }
    li { padding: 8px 0; border-bottom: 1px solid #eee; }
  `]
})
export class MesasComponent {
  pedidos$ = this.pedidoUseCase.listar();

  constructor(private pedidoUseCase: PedidoUseCaseService) {}
}
