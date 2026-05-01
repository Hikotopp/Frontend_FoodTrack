import { Observable } from 'rxjs';
import { TableSummary, TableDashboard } from '../entities/table.entity';

export interface TablePort {
  listTables(): Observable<TableSummary[]>;
  getTableDashboard(id: number): Observable<TableDashboard>;
  createTable(tableNumber: number): Observable<TableSummary>;
  deleteTable(id: number): Observable<void>;
  updateTableStatus(id: number, status: string): Observable<TableSummary>;
  addOrderLine(tableId: number, menuItemId: number, quantity: number): Observable<TableDashboard>;
  updateOrderLine(tableId: number, lineId: number, quantity: number): Observable<TableDashboard>;
  removeOrderLine(tableId: number, lineId: number): Observable<TableDashboard>;
  closeOrder(tableId: number): Observable<TableDashboard>;
}