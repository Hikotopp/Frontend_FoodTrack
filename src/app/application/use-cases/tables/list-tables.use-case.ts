import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpAdapter } from '../../adapters/http/table-http.adapter';
import { TableSummary } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class ListTablesUseCase {
  constructor(private tableHttp: TableHttpAdapter) {}
  execute(): Observable<TableSummary[]> {
    return this.tableHttp.listTables();
  }
}