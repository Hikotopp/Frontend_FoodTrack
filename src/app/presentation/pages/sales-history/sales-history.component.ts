import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, takeUntil, timeout } from 'rxjs';
import { BaseDataComponent } from '../../../shared/base-data.component';
import { SessionService } from '../../../infrastructure/services/session.service';
import { SaleHistoryItem, SaleStatus, SalesHistoryService } from '../../../infrastructure/services/sales-history.service';
import { AdminReportService } from '../../../infrastructure/services/admin-report.service';

type ReportToastType = 'success' | 'error';

interface ReportToast {
  message: string;
  type: ReportToastType;
}

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
  reportToast: ReportToast | null = null;
  readonly statusOptions: SaleStatus[] = ['CLOSED', 'CANCELLED'];
  private reportToastTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private salesHistoryService: SalesHistoryService,
    private adminReportService: AdminReportService,
    private sessionService: SessionService,
    private router: Router,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  override ngOnDestroy(): void {
    this.clearReportToastTimer();
    super.ngOnDestroy();
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

  generateReport(): void {
    if (!this.isAdmin) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.hideReportToast();

    this.adminReportService.generateNow().pipe(
      timeout(this.requestTimeoutMs),
      finalize(() => {
        this.isSaving = false;
        this.cdr.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        const reportService = response.reportService;
        if (!reportService) {
          this.showReportToast(response.message, response.success ? 'success' : 'error');
          return;
        }

        const sentTo = reportService.sentTo?.join(', ') || 'administradores configurados';
        const message = reportService.emailSent
          ? `Reporte enviado a ${sentTo}.`
          : `Reporte generado correctamente. ${reportService.emailError ?? response.message}`.trim();
        this.showReportToast(message, response.success ? 'success' : 'error');
      },
      error: () => {
        this.showReportToast('No se pudo generar el reporte.', 'error');
      }
    });
  }

  hideReportToast(): void {
    this.clearReportToastTimer();
    this.reportToast = null;
    this.cdr.markForCheck();
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

  private showReportToast(message: string, type: ReportToastType): void {
    this.clearReportToastTimer();
    this.reportToast = { message, type };
    this.reportToastTimeoutId = setTimeout(() => {
      this.reportToast = null;
      this.reportToastTimeoutId = null;
      this.cdr.markForCheck();
    }, 60000);
    this.cdr.markForCheck();
  }

  private clearReportToastTimer(): void {
    if (this.reportToastTimeoutId) {
      clearTimeout(this.reportToastTimeoutId);
      this.reportToastTimeoutId = null;
    }
  }
}
