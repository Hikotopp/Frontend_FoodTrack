import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableDashboard } from '../../../domain/entities/table.entity';
import { TABLE_PORT } from '../../../domain/ports/table-port.token';
import { TablePort } from '../../../domain/ports/table.port';

@Injectable({ providedIn: 'root' })
export class UpdateOrderLineUseCase {
  constructor(@Inject(TABLE_PORT) private tablePort: TablePort) {}
  execute(tableId: number, lineId: number, quantity: number): Observable<TableDashboard> {
    return this.tablePort.updateOrderLine(tableId, lineId, quantity);
  }
}
