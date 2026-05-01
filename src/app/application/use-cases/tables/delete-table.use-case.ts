import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHttpAdapter } from '../../adapters/http/table-http.adapter';

@Injectable({ providedIn: 'root' })
export class DeleteTableUseCase {
  constructor(private tableHttp: TableHttpAdapter) {}
  execute(id: number): Observable<void> {
    return this.tableHttp.deleteTable(id);
  }
}