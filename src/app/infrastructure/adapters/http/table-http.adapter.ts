import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TablePort } from '../../../domain/ports/table.port';
import { TableSummary, TableDashboard } from '../../../domain/entities/table.entity';

@Injectable({ providedIn: 'root' })
export class TableHttpAdapter implements TablePort {
  private apiUrl = `${environment.apiUrl}/tables`;
  constructor(private http: HttpClient) {}

  listTables(): Observable<TableSummary[]> {
    return this.http.get<TableSummary[]>(this.apiUrl);
  }
  getTableDashboard(id: number): Observable<TableDashboard> {
    return this.http.get<TableDashboard>(`${this.apiUrl}/${id}`);
  }
  createTable(tableNumber: number): Observable<TableSummary> {
    return this.http.post<TableSummary>(this.apiUrl, { tableNumber });
  }
  deleteTable(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateTableStatus(id: number, status: string): Observable<TableSummary> {
    return this.http.patch<TableSummary>(`${this.apiUrl}/${id}/status`, { status });
  }
  addOrderLine(tableId: number, menuItemId: number, quantity: number): Observable<TableDashboard> {
    return this.http.post<TableDashboard>(`${this.apiUrl}/${tableId}/order-lines`, { menuItemId, quantity });
  }
  updateOrderLine(tableId: number, lineId: number, quantity: number): Observable<TableDashboard> {
    return this.http.patch<TableDashboard>(`${this.apiUrl}/${tableId}/order-lines/${lineId}`, { quantity });
  }
  removeOrderLine(tableId: number, lineId: number): Observable<TableDashboard> {
    return this.http.delete<TableDashboard>(`${this.apiUrl}/${tableId}/order-lines/${lineId}`);
  }
  closeOrder(tableId: number): Observable<TableDashboard> {
    return this.http.post<TableDashboard>(`${this.apiUrl}/${tableId}/close-order`, {});
  }
}
