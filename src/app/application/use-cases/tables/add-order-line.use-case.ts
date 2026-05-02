import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableDashboard } from '../../../domain/entities/table.entity';
import { TABLE_PORT } from '../../../domain/ports/table-port.token';
import { TablePort } from '../../../domain/ports/table.port';

@Injectable({ providedIn: 'root' })
export class AddOrderLineUseCase {
  constructor(@Inject(TABLE_PORT) private tablePort: TablePort) {}
  execute(tableId: number, menuItemId: number, quantity: number): Observable<TableDashboard> {
    return this.tablePort.addOrderLine(tableId, menuItemId, quantity);
  }
}
