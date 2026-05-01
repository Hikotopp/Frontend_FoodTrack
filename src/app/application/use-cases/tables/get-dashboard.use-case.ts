import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpAdapter } from '../../adapters/http/table-http.adapter';
import { TableDashboard } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class GetDashboardUseCase {
  constructor(private tableHttp: TableHttpAdapter) {}
  execute(id: number): Observable<TableDashboard> {
    return this.tableHttp.getTableDashboard(id);
  }
}