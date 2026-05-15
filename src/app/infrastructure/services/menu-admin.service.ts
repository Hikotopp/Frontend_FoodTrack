import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MenuCategory, MenuItem } from '../../domain/entities/table.entity';

export interface MenuItemPayload {
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  stockQuantity: number;
  active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MenuAdminService {
  private readonly apiUrl = `${environment.apiUrl}/menu-items`;

  constructor(private readonly http: HttpClient) {}

  listItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/admin`);
  }

  createItem(payload: MenuItemPayload): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.apiUrl, payload);
  }

  updateItem(id: number, payload: Required<MenuItemPayload>): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/${id}`, payload);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
