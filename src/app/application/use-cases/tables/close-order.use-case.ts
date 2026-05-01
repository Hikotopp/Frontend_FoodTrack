import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpAdapter } from '../../adapters/http/table-http.adapter';
import { TableDashboard } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class CloseOrderUseCase {
  constructor(private tableHttp: TableHttpAdapter) {}
  execute(tableId: number): Observable<TableDashboard> {
    return this.tableHttp.closeOrder(tableId);
  }
}