import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePort } from '../../../domain/ports/table.port';
import { TableDashboard } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class GetDashboardUseCase {
  constructor(private tablePort: TablePort) {}
  execute(id: number): Observable<TableDashboard> {
    return this.tablePort.getTableDashboard(id);
  }
}