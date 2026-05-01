import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BaseDataComponent } from '../../../shared/base-data.component';
import { SessionService } from '../../../infrastructure/services/session.service';
import { SaleHistoryItem, SaleStatus, SalesHistoryService } from '../../../infrastructure/services/sales-history.service';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalesHistoryComponent extends BaseDataComponent implements OnInit {
  sales: SaleHistoryItem[] = [];
  statusDrafts: Record<number, SaleStatus> = {};
  readonly statusOptions: SaleStatus[] = ['CLOSED', 'CANCELLED'];

  constructor(
    private salesHistoryService: SalesHistoryService,
    private sessionService: SessionService,
    private router: Router,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  get userName(): string {
    return this.sessionService.getStoredUser()?.fullName ?? '';
  }

  get isAdmin(): boolean {
    return this.sessionService.hasRole('ADMIN');
  }

  loadHistory(): void {
    this.loadData(
      this.salesHistoryService.listHistory(),
      (sales) => {
        this.sales = sales;
        this.statusDrafts = Object.fromEntries(sales.map(sale => [sale.id, sale.status]));
      },
      'No se pudo cargar el historial de ventas.'
    );
  }

  updateStatus(sale: SaleHistoryItem): void {
    if (!this.isAdmin) return;
    const status = this.statusDrafts[sale.id] ?? sale.status;
    this.saveData(
      this.salesHistoryService.updateStatus(sale.id, status),
      (updated) => {
        this.sales = this.sales.map(item => item.id === updated.id ? updated : item);
        this.statusDrafts[updated.id] = updated.status;
      },
      'No se pudo actualizar el estado de la venta.'
    );
  }

  logout(): void {
    this.sessionService.logout();
    this.router.navigate(['/']);
  }

  formatStatus(status: SaleStatus): string {
    return status === 'CLOSED' ? 'Cerrada' : 'Anulada';
  }

  trackBySaleId(_: number, sale: SaleHistoryItem): number {
    return sale.id;
  }
}
