import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePort } from '../../../domain/ports/table.port';
import { TableSummary } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class CreateTableUseCase {
  constructor(private tablePort: TablePort) {}
  execute(tableNumber: number): Observable<TableSummary> {
    return this.tablePort.createTable(tableNumber);
  }
}