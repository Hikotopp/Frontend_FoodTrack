import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TABLE_PORT } from '../../../domain/ports/table-port.token';
import { TablePort } from '../../../domain/ports/table.port';

@Injectable({ providedIn: 'root' })
export class DeleteTableUseCase {
  constructor(@Inject(TABLE_PORT) private tablePort: TablePort) {}
  execute(id: number): Observable<void> {
    return this.tablePort.deleteTable(id);
  }
}
