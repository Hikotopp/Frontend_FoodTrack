import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BaseDataComponent } from '../../../shared/base-data.component';
import { SessionService } from '../../../infrastructure/services/session.service';
import { TableService, TableStatus, TableSummary } from '../../../infrastructure/services/table.service';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MesasComponent extends BaseDataComponent implements OnInit {
  tables: TableSummary[] = [];
  userName = '';
  isAdmin = false;

  constructor(
    private tableService: TableService,
    private sessionService: SessionService,
    private router: Router,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    const user = this.sessionService.getStoredUser();
    this.userName = user?.fullName ?? '';
    this.isAdmin = this.sessionService.hasRole('ADMIN');
    this.loadTables();
  }

  loadTables(): void {
    this.loadData(
      this.tableService.listTables(),
      (tables) => {
        this.tables = [...tables].sort((a, b) => a.tableNumber - b.tableNumber);
      },
      'No se pudieron cargar las mesas. Intenta recargar.'
    );
  }

  createTable(): void {
    if (!this.isAdmin) return;
    const nextNumber = this.tables.length > 0
      ? Math.max(...this.tables.map(t => t.tableNumber)) + 1
      : 1;

    this.saveData(
      this.tableService.createTable(nextNumber),
      () => this.loadTables(),
      'No se pudo crear la mesa.'
    );
  }

  deleteLastTable(): void {
    if (!this.isAdmin) return;
    const last = [...this.tables].sort((a, b) => b.tableNumber - a.tableNumber)[0];
    if (!last) return;

    this.saveData(
      this.tableService.deleteTable(last.id),
      () => this.loadTables(),
      'No se pudo eliminar la mesa.'
    );
  }

  openTable(table: TableSummary): void {
    this.router.navigate(['/mesas', table.id]);
  }

  logout(): void {
    this.sessionService.logout();
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

  trackByTableId(_: number, table: TableSummary): number {
    return table.id;
  }
}