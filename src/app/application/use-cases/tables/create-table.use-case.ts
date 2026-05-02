import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableSummary } from '../../../domain/entities/table.entity';
import { TABLE_PORT } from '../../../domain/ports/table-port.token';
import { TablePort } from '../../../domain/ports/table.port';

@Injectable({ providedIn: 'root' })
export class CreateTableUseCase {
  constructor(@Inject(TABLE_PORT) private tablePort: TablePort) {}
  execute(tableNumber: number): Observable<TableSummary> {
    return this.tablePort.createTable(tableNumber);
  }
}
