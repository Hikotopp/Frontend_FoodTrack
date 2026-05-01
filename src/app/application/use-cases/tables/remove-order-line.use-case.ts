import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePort } from '../../../domain/ports/table.port';
import { TableDashboard } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class RemoveOrderLineUseCase {
  constructor(private tablePort: TablePort) {}
  execute(tableId: number, lineId: number): Observable<TableDashboard> {
    return this.tablePort.removeOrderLine(tableId, lineId);
  }
}