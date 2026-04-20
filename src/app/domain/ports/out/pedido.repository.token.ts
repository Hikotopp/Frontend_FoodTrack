import { InjectionToken } from '@angular/core';
import { PedidoRepository } from './pedido.repository';

export const PEDIDO_REPOSITORY = new InjectionToken<PedidoRepository>('PedidoRepository');
