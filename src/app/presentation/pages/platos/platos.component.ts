import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BaseDataComponent } from '../../../shared/base-data.component';
import { MenuCategory, MenuItem } from '../../../domain/entities/table.entity';
import { MenuAdminService } from '../../../infrastructure/services/menu-admin.service';
import { SessionService } from '../../../infrastructure/services/session.service';

@Component({
  selector: 'app-platos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './platos.component.html',
  styleUrls: ['./platos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatosComponent extends BaseDataComponent implements OnInit {
  items: MenuItem[] = [];
  editingItem: MenuItem | null = null;

  readonly categoryOptions: MenuCategory[] = [
    'APPETIZER', 'BURGER', 'HOT_DOG', 'OTHER', 'DRINK', 'DESSERT', 'COMBO', 'ADDITIONAL', 'PROMOTION',
    'SOUP', 'MAIN_COURSE', 'SALAD'
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
    PROMOTION: 'Promos',
    SOUP: 'Sopas',
    MAIN_COURSE: 'Platos fuertes',
    SALAD: 'Ensaladas'
  };

  readonly itemForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
    category: ['MAIN_COURSE' as MenuCategory, [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    active: [true]
  });

  constructor(
    private readonly menuAdminService: MenuAdminService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    if (!this.sessionService.hasRole('ADMIN')) {
      this.router.navigate(['/mesas']);
      return;
    }
    this.loadItems();
  }

  get userName(): string {
    return this.sessionService.getStoredUser()?.fullName ?? '';
  }

  get formTitle(): string {
    return this.editingItem ? 'Editar plato' : 'Agregar plato';
  }

  loadItems(): void {
    this.loadData(
      this.menuAdminService.listItems(),
      (items) => {
        this.items = items;
      },
      'No se pudieron cargar los platos.'
    );
  }

  saveItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.errorMessage = 'Completa nombre, descripcion, categoria, precio y cantidad con datos validos.';
      return;
    }

    const value = this.itemForm.getRawValue();
    const payload = {
      name: value.name.trim(),
      description: value.description.trim(),
      category: value.category,
      price: Number(value.price),
      stockQuantity: Number(value.stockQuantity),
      active: value.active
    };

    const request$ = this.editingItem
      ? this.menuAdminService.updateItem(this.editingItem.id, payload)
      : this.menuAdminService.createItem(payload);

    this.saveData(
      request$,
      () => {
        this.resetForm();
        this.loadItems();
      },
      this.editingItem ? 'No se pudo actualizar el plato.' : 'No se pudo crear el plato.'
    );
  }

  editItem(item: MenuItem): void {
    this.editingItem = item;
    this.itemForm.reset({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      stockQuantity: item.stockQuantity,
      active: item.available
    });
  }

  deleteItem(item: MenuItem): void {
    const confirmed = window.confirm(`Eliminar ${item.name} del menu?`);
    if (!confirmed) {
      return;
    }

    this.saveData(
      this.menuAdminService.deleteItem(item.id),
      () => this.loadItems(),
      'No se pudo eliminar el plato.'
    );
  }

  resetForm(): void {
    this.editingItem = null;
    this.itemForm.reset({
      name: '',
      description: '',
      category: 'MAIN_COURSE',
      price: 0,
      stockQuantity: 0,
      active: true
    });
  }

  logout(): void {
    this.sessionService.logout();
    this.router.navigate(['/']);
  }

  formatCategory(category: MenuCategory): string {
    return this.categoryLabels[category];
  }

  trackByItemId(_: number, item: MenuItem): number {
    return item.id;
  }
}
