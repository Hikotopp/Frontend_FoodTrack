import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BaseDataComponent } from '../../../shared/base-data.component';
import { SessionService } from '../../../infrastructure/services/session.service';
import {
  MenuCategory,
  MenuItem,
  OrderLine,
  TableDashboard,
  TableSummary,
  TableService,
  TableStatus
} from '../../../infrastructure/services/table.service';

type MenuGroup = {
  category: MenuCategory;
  label: string;
  items: MenuItem[];
};

@Component({
  selector: 'app-mesa-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './mesa-detail.component.html',
  styleUrls: ['./mesa-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MesaDetailComponent extends BaseDataComponent implements OnInit {
  dashboard: TableDashboard | null = null;
  menuGroups: MenuGroup[] = [];
  tableId = 0;
  statusDraft: TableStatus = 'AVAILABLE';
  menuQuantities: Record<number, number> = {};
  lineQuantities: Record<number, number> = {};

  private readonly categoryOrder: MenuCategory[] = [
    'APPETIZER', 'BURGER', 'HOT_DOG', 'OTHER', 'DRINK', 'DESSERT', 'COMBO', 'ADDITIONAL', 'PROMOTION'
  ];
  readonly categoryLabels: Record<MenuCategory, string> = {
    APPETIZER: 'Entradas',
    BURGER: 'Hamburguesas',
    HOT_DOG: 'Perros calientes',
    OTHER: 'Otros',
    DRINK: 'Bebidas',
    DESSERT: 'Postres',
    COMBO: 'Combos',
    ADDITIONAL: 'Adicionales y salsas',
    PROMOTION: 'Promos'
  };
  readonly statusOptions: TableStatus[] = [
    'AVAILABLE', 'OCCUPIED', 'SERVING', 'WAITING_PAYMENT', 'CLEANING'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService,
    private sessionService: SessionService,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    this.tableId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.tableId) || this.tableId <= 0) {
      this.errorMessage = 'El identificador de mesa no es valido.';
      this.isLoading = false;
      return;
    }
    this.loadDashboard();
  }

  get userName(): string {
    return this.sessionService.getStoredUser()?.fullName ?? '';
  }

  get userRole(): string {
    return this.sessionService.getStoredUser()?.role ?? '';
  }

  get orderLines(): OrderLine[] {
    return this.dashboard?.currentOrder?.lines ?? [];
  }

  loadDashboard(): void {
    this.loadData(
      this.tableService.getTableDashboard(this.tableId),
      (dashboard) => this.applyDashboard(dashboard),
      'No fue posible cargar el detalle de la mesa. Intenta de nuevo.'
    );
  }

  updateStatus(): void {
    if (!this.dashboard) return;
    this.saveData(
      this.tableService.updateTableStatus(this.dashboard.table.id, this.statusDraft),
      (summary) => this.applyTableSummary(summary),
      'No fue posible actualizar el estado de la mesa.'
    );
  }

  addItem(menuItemId: number): void {
    const quantity = Math.max(1, Number(this.menuQuantities[menuItemId] ?? 1));
    this.saveData(
      this.tableService.addOrderLine(this.tableId, menuItemId, quantity),
      (dashboard) => this.applyDashboard(dashboard),
      'No fue posible agregar el producto al pedido.'
    );
  }

  updateLine(lineId: number): void {
    const quantity = Math.max(1, Number(this.lineQuantities[lineId] ?? 1));
    this.saveData(
      this.tableService.updateOrderLine(this.tableId, lineId, quantity),
      (dashboard) => this.applyDashboard(dashboard),
      'No fue posible actualizar la cantidad del item.'
    );
  }

  removeLine(lineId: number): void {
    this.saveData(
      this.tableService.removeOrderLine(this.tableId, lineId),
      (dashboard) => this.applyDashboard(dashboard),
      'No fue posible quitar el item del pedido.'
    );
  }

  closeOrder(): void {
    this.saveData(
      this.tableService.closeOrder(this.tableId),
      (dashboard) => this.applyDashboard(dashboard),
      'No fue posible cerrar la cuenta de la mesa.'
    );
  }

  retryLoad(): void {
    this.loadDashboard();
  }

  goBack(): void {
    this.router.navigate(['/mesas']);
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

  trackByGroupCategory(_: number, group: MenuGroup): MenuCategory {
    return group.category;
  }
  trackByMenuItemId(_: number, item: MenuItem): number {
    return item.id;
  }
  trackByOrderLineId(_: number, line: OrderLine): number {
    return line.id;
  }

  private applyTableSummary(summary: TableSummary): void {
    if (!this.dashboard) return;
    this.dashboard = {
      ...this.dashboard,
      table: { ...this.dashboard.table, status: summary.status },
      currentOrder: this.dashboard.currentOrder
        ? { ...this.dashboard.currentOrder, total: summary.total }
        : null
    };
    this.statusDraft = summary.status;
    this.cdr.markForCheck();
  }

  private applyDashboard(dashboard: TableDashboard): void {
    this.dashboard = dashboard;
    this.menuGroups = this.buildMenuGroups(dashboard.menuItems);
    this.statusDraft = dashboard.table.status;
    this.menuQuantities = Object.fromEntries(
      dashboard.menuItems.map(item => [item.id, this.menuQuantities[item.id] ?? 1])
    );
    this.lineQuantities = Object.fromEntries(
      (dashboard.currentOrder?.lines ?? []).map(line => [line.id, line.quantity])
    );
    this.errorMessage = '';
  }

  private buildMenuGroups(menuItems: MenuItem[]): MenuGroup[] {
    const groupedItems = new Map<MenuCategory, MenuItem[]>();
    for (const item of menuItems) {
      const list = groupedItems.get(item.category) ?? [];
      list.push(item);
      groupedItems.set(item.category, list);
    }
    return this.categoryOrder
      .map(cat => ({
        category: cat,
        label: this.categoryLabels[cat],
        items: groupedItems.get(cat) ?? []
      }))
      .filter(group => group.items.length > 0);
  }
}
