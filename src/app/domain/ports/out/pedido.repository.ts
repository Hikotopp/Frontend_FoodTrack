import { Observable } from 'rxjs';
import { Pedido } from '../../models/pedido.model';

export interface PedidoRepository {
  listar(): Observable<Pedido[]>;
  obtenerPorId(id: number): Observable<Pedido>;
  guardar(pedido: Pedido): Observable<Pedido>;
  actualizarEstado(id: number, estado: string): Observable<Pedido>;
  eliminar(id: number): Observable<void>;
}
