import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpAdapter } from '../../adapters/http/table-http.adapter';
import { TableDashboard } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class RemoveOrderLineUseCase {
  constructor(private tableHttp: TableHttpAdapter) {}
  execute(tableId: number, lineId: number): Observable<TableDashboard> {
    return this.tableHttp.removeOrderLine(tableId, lineId);
  }
}