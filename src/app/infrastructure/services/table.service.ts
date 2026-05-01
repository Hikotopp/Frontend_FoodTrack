import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'SERVING' | 'WAITING_PAYMENT' | 'CLEANING';
export type OrderStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';
export type MenuCategory = 'APPETIZER' | 'SOUP' | 'MAIN_COURSE' | 'SALAD' | 'DESSERT' | 'DRINK';

export interface TableSummary {
  id: number;
  tableNumber: number;
  status: TableStatus;
  total: number;
  itemCount: number;
}

export interface RestaurantTable {
  id: number;
  tableNumber: number;
  status: TableStatus;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  active: boolean;
}

export interface OrderLine {
  id: number;
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerOrder {
  id: number;
  tableId: number;
  createdByUserId: number;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  lines: OrderLine[];
}

export interface TableDashboard {
  table: RestaurantTable;
  currentOrder: CustomerOrder | null;
  menuItems: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class TableService {
  private readonly apiUrl = `${environment.apiUrl}/tables`;

  constructor(private readonly http: HttpClient) {}

  listTables(): Observable<TableSummary[]> {
    return this.http.get<TableSummary[]>(this.apiUrl);
  }

  getTableDashboard(tableId: number): Observable<TableDashboard> {
    return this.http.get<TableDashboard>(`${this.apiUrl}/${tableId}`);
  }

  createTable(tableNumber: number): Observable<TableSummary> {
    return this.http.post<TableSummary>(this.apiUrl, { tableNumber });
  }

  deleteTable(tableId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${tableId}`);
  }

  updateTableStatus(tableId: number, status: TableStatus): Observable<TableSummary> {
    return this.http.patch<TableSummary>(`${this.apiUrl}/${tableId}/status`, { status });
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
