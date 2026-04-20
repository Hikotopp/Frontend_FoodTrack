import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../domain/models/pedido.model';
import { PedidoRepository } from '../../domain/ports/out/pedido.repository';
import { PEDIDO_REPOSITORY } from '../../domain/ports/out/pedido.repository.token';
import { PedidoUseCase } from '../../domain/ports/in/pedido.use-case';

@Injectable({
  providedIn: 'root'
})
export class PedidoUseCaseService implements PedidoUseCase {
  constructor(@Inject(PEDIDO_REPOSITORY) private pedidoRepository: PedidoRepository) {}

  listar(): Observable<Pedido[]> {
    return this.pedidoRepository.listar();
  }

  obtenerPorId(id: number): Observable<Pedido> {
    return this.pedidoRepository.obtenerPorId(id);
  }

  guardar(pedido: Pedido): Observable<Pedido> {
    return this.pedidoRepository.guardar(pedido);
  }

  actualizarEstado(id: number, estado: string): Observable<Pedido> {
    return this.pedidoRepository.actualizarEstado(id, estado);
  }

  eliminar(id: number): Observable<void> {
    return this.pedidoRepository.eliminar(id);
  }
}
