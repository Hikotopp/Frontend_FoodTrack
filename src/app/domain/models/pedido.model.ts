export interface DetallePedido {
  id?: number;
  pedidoId?: number;
  productoId?: number;
  cantidad?: number;
  precioUnitario?: number;
  subtotal?: number;
}

export interface Pedido {
  id?: number;
  mesaId?: number;
  usuarioId?: number;
  fechaHora?: string;
  estado?: string;
  total?: number;
  detalles?: DetallePedido[];
}
