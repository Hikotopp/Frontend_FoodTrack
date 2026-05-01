import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpAdapter } from '../../adapters/http/table-http.adapter';
import { TableDashboard } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class AddOrderLineUseCase {
  constructor(private tableHttp: TableHttpAdapter) {}
  execute(tableId: number, menuItemId: number, quantity: number): Observable<TableDashboard> {
    return this.tableHttp.addOrderLine(tableId, menuItemId, quantity);
  }
}