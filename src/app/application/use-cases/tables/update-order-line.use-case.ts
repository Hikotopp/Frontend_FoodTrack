import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpAdapter } from '../../adapters/http/table-http.adapter';
import { TableDashboard } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class UpdateOrderLineUseCase {
  constructor(private tableHttp: TableHttpAdapter) {}
  execute(tableId: number, lineId: number, quantity: number): Observable<TableDashboard> {
    return this.tableHttp.updateOrderLine(tableId, lineId, quantity);
  }
}