import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePort } from '../../../domain/ports/table.port';
import { TableSummary } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class ListTablesUseCase {
  constructor(private tablePort: TablePort) {}
  execute(): Observable<TableSummary[]> {
    return this.tablePort.listTables();
  }
}