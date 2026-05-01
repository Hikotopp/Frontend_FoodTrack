import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePort } from '../../../domain/ports/table.port';
import { TableSummary } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class UpdateTableStatusUseCase {
  constructor(private tablePort: TablePort) {}
  execute(id: number, status: string): Observable<TableSummary> {
    return this.tablePort.updateTableStatus(id, status);
  }
}