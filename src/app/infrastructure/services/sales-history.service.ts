import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type SaleStatus = 'CLOSED' | 'CANCELLED';

export interface SaleLine {
  id: number;
  menuItemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleHistoryItem {
  id: number;
  tableId: number;
  tableNumber: number | null;
  createdByUserId: number;
  createdByName: string;
  status: SaleStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
  lines: SaleLine[];
}

@Injectable({ providedIn: 'root' })
export class SalesHistoryService {
  private readonly apiUrl = `${environment.apiUrl}/sales/history`;

  constructor(private readonly http: HttpClient) {}

  listHistory(): Observable<SaleHistoryItem[]> {
    return this.http.get<SaleHistoryItem[]>(this.apiUrl);
  }

  updateStatus(orderId: number, status: SaleStatus): Observable<SaleHistoryItem> {
    return this.http.patch<SaleHistoryItem>(`${this.apiUrl}/${orderId}/status`, { status });
  }
}
