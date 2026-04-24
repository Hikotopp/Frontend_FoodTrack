import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable, finalize, timeout } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { TableService, TableStatus, TableSummary } from '../../services/table.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MesasComponent implements OnInit {
  tables: TableSummary[] = [];
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  userName = '';
  isAdmin = false;
  private readonly requestTimeoutMs = 15000;

  constructor(
    private readonly tableService: TableService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.getStoredUser()?.fullName ?? '';
    this.isAdmin = this.authService.hasRole('ADMIN');
    this.loadTables();
  }

  loadTables(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.tableService.listTables().pipe(
      timeout(this.requestTimeoutMs),
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      })
    ).subscribe({
      next: (tables) => {
        this.tables = [...tables].sort((a, b) => a.tableNumber - b.tableNumber);
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar las mesas. Intenta recargar.';
      }
    });
  }

  createTable(): void {
    if (!this.isAdmin) {
      return;
    }

    const nextTableNumber = this.tables.length > 0
      ? Math.max(...this.tables.map((table) => table.tableNumber)) + 1
      : 1;

    this.runAdminAction(
      this.tableService.createTable(nextTableNumber),
      'No se pudo crear la mesa.'
    );
  }

  deleteLastTable(): void {
    if (!this.isAdmin) {
      return;
    }

    const lastTable = [...this.tables].sort((a, b) => b.tableNumber - a.tableNumber)[0];
    if (!lastTable) {
      return;
    }

    this.runAdminAction(
      this.tableService.deleteTable(lastTable.id),
      'No se pudo eliminar la mesa.'
    );
  }

  openTable(table: TableSummary): void {
    this.router.navigate(['/mesas', table.id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  formatStatus(status: TableStatus): string {
    const labels: Record<TableStatus, string> = {
      AVAILABLE: 'Disponible',
      OCCUPIED: 'Ocupada',
      SERVING: 'Sirviendo',
      WAITING_PAYMENT: 'Esperando pago',
      CLEANING: 'Limpieza'
    };

    return labels[status];
  }

  trackByTableId(index: number, table: TableSummary): number {
    return table.id;
  }

  private runAdminAction(request$: Observable<unknown>, message: string): void {
    this.isSaving = true;
    this.errorMessage = '';

    request$.pipe(
      timeout(this.requestTimeoutMs),
      finalize(() => {
        this.isSaving = false;
        this.changeDetector.markForCheck();
      })
    ).subscribe({
      next: () => this.loadTables(),
      error: () => {
        this.errorMessage = message;
      }
    });
  }
}
