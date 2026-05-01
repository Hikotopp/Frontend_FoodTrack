import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePort } from '../../../domain/ports/table.port';
import { TableDashboard } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class AddOrderLineUseCase {
  constructor(private tablePort: TablePort) {}
  execute(tableId: number, menuItemId: number, quantity: number): Observable<TableDashboard> {
    return this.tablePort.addOrderLine(tableId, menuItemId, quantity);
  }
}