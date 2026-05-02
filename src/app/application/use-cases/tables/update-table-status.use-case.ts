import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableStatus, TableSummary } from '../../../domain/entities/table.entity';
import { TABLE_PORT } from '../../../domain/ports/table-port.token';
import { TablePort } from '../../../domain/ports/table.port';

@Injectable({ providedIn: 'root' })
export class UpdateTableStatusUseCase {
  constructor(@Inject(TABLE_PORT) private tablePort: TablePort) {}
  execute(id: number, status: TableStatus): Observable<TableSummary> {
    return this.tablePort.updateTableStatus(id, status);
  }
}
