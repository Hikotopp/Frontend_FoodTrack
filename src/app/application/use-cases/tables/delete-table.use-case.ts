import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TablePort } from '../../../domain/ports/table.port';

@Injectable({ providedIn: 'root' })
export class DeleteTableUseCase {
  constructor(private tablePort: TablePort) {}
  execute(id: number): Observable<void> {
    return this.tablePort.deleteTable(id);
  }
}