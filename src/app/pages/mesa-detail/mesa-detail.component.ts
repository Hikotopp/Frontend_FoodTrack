import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, finalize, timeout } from 'rxjs';
import {
  MenuCategory,
  MenuItem,
  OrderLine,
  TableDashboard,
  TableSummary,
  TableService,
  TableStatus
} from '../../services/table.service';
import { AuthService } from '../../services/auth.service';

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
export class MesaDetailComponent implements OnInit {
  dashboard: TableDashboard | null = null;
  menuGroups: MenuGroup[] = [];
  tableId = 0;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  statusDraft: TableStatus = 'AVAILABLE';
  menuQuantities: Record<number, number> = {};
  lineQuantities: Record<number, number> = {};
  private readonly requestTimeoutMs = 15000;
  private readonly categoryOrder: MenuCategory[] = [
    'APPETIZER',
    'SOUP',
    'MAIN_COURSE',
    'SALAD',
    'DESSERT',
    'DRINK'
  ];

  readonly categoryLabels: Record<MenuCategory, string> = {
    APPETIZER: 'Entradas',
    SOUP: 'Sopas',
    MAIN_COURSE: 'Platos fuertes',
    SALAD: 'Ensaladas',
    DESSERT: 'Postres',
    DRINK: 'Bebidas'
  };

  readonly statusOptions: TableStatus[] = [
    'AVAILABLE',
    'OCCUPIED',
    'SERVING',
    'WAITING_PAYMENT',
    'CLEANING'
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tableService: TableService,
    private readonly authService: AuthService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tableId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.tableId) || this.tableId <= 0) {
      this.isLoading = false;
      this.errorMessage = 'El identificador de mesa no es valido.';
      return;
    }
    this.loadDashboard();
  }

  get userName(): string {
    return this.authService.getStoredUser()?.fullName ?? '';
  }

  get userRole(): string {
    return this.authService.getStoredUser()?.role ?? '';
  }

  get orderLines(): OrderLine[] {
    return this.dashboard?.currentOrder?.lines ?? [];
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.tableService.getTableDashboard(this.tableId).pipe(
      timeout(this.requestTimeoutMs),
      finalize(() => {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      })
    ).subscribe({
      next: (dashboard) => this.applyDashboard(dashboard),
      error: () => {
        this.dashboard = null;
        this.menuGroups = [];
        this.errorMessage = 'No fue posible cargar el detalle de la mesa. Intenta de nuevo.';
      }
    });
  }

  updateStatus(): void {
    if (!this.dashboard) {
      return;
    }

    this.runAction(
      this.tableService.updateTableStatus(this.dashboard.table.id, this.statusDraft),
      (summary) => this.applyTableSummary(summary),
      'No fue posible actualizar el estado de la mesa.'
    );
  }

  addItem(menuItemId: number): void {
    const quantity = Math.max(1, Number(this.menuQuantities[menuItemId] ?? 1));
    this.runAction(
      this.tableService.addOrderLine(this.tableId, menuItemId, quantity),
      (dashboard) => this.applyDashboard(dashboard),
      'No fue posible agregar el producto al pedido.'
    );
  }

  updateLine(lineId: number): void {
    const quantity = Math.max(1, Number(this.lineQuantities[lineId] ?? 1));
    this.runAction(
      this.tableService.updateOrderLine(this.tableId, lineId, quantity),
      (dashboard) => this.applyDashboard(dashboard),
      'No fue posible actualizar la cantidad del item.'
    );
  }

  removeLine(lineId: number): void {
    this.runAction(
      this.tableService.removeOrderLine(this.tableId, lineId),
      (dashboard) => this.applyDashboard(dashboard),
      'No fue posible quitar el item del pedido.'
    );
  }

  closeOrder(): void {
    this.runAction(
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

  trackByGroupCategory(index: number, group: MenuGroup): MenuCategory {
    return group.category;
  }

  trackByMenuItemId(index: number, item: MenuItem): number {
    return item.id;
  }

  trackByOrderLineId(index: number, line: OrderLine): number {
    return line.id;
  }

  private applyTableSummary(summary: TableSummary): void {
    if (!this.dashboard) {
      return;
    }

    this.dashboard = {
      ...this.dashboard,
      table: {
        ...this.dashboard.table,
        status: summary.status
      },
      currentOrder: this.dashboard.currentOrder
        ? {
          ...this.dashboard.currentOrder,
          total: summary.total
        }
        : null
    };
    this.statusDraft = summary.status;
  }

  private applyDashboard(dashboard: TableDashboard): void {
    this.dashboard = dashboard;
    this.menuGroups = this.buildMenuGroups(dashboard.menuItems);
    this.statusDraft = dashboard.table.status;
    this.menuQuantities = Object.fromEntries(
      dashboard.menuItems.map((item) => [item.id, this.menuQuantities[item.id] ?? 1])
    );
    this.lineQuantities = Object.fromEntries((dashboard.currentOrder?.lines ?? []).map((line) => [line.id, line.quantity]));
    this.errorMessage = '';
  }

  private runAction<T>(
    request$: Observable<T>,
    onSuccess: (value: T) => void,
    message: string
  ): void {
    this.isSaving = true;
    this.errorMessage = '';

    request$.pipe(
      timeout(this.requestTimeoutMs),
      finalize(() => {
        this.isSaving = false;
        this.changeDetector.markForCheck();
      })
    ).subscribe({
      next: onSuccess,
      error: () => {
        this.errorMessage = message;
      }
    });
  }

  private buildMenuGroups(menuItems: MenuItem[]): MenuGroup[] {
    const groupedItems = new Map<MenuCategory, MenuItem[]>();
    for (const item of menuItems) {
      const categoryItems = groupedItems.get(item.category) ?? [];
      categoryItems.push(item);
      groupedItems.set(item.category, categoryItems);
    }

    return this.categoryOrder
      .map((category) => ({
        category,
        label: this.categoryLabels[category],
        items: groupedItems.get(category) ?? []
      }))
      .filter((group) => group.items.length > 0);
  }
}
