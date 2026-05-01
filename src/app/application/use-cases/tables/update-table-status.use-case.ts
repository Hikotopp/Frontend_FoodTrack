import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpAdapter } from '../../adapters/http/table-http.adapter';
import { TableSummary } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class UpdateTableStatusUseCase {
  constructor(private tableHttp: TableHttpAdapter) {}
  execute(id: number, status: string): Observable<TableSummary> {
    return this.tableHttp.updateTableStatus(id, status);
  }
}