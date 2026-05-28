import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatosComponent } from './platos.component';
import { MenuAdminService } from '../../../infrastructure/services/menu-admin.service';
import { SessionService } from '../../../infrastructure/services/session.service';
import { of, throwError } from 'rxjs';
import { MenuItem, MenuCategory } from '../../../domain/entities/table.entity';

describe('PlatosComponent', () => {
  let component: PlatosComponent;
  let fixture: ComponentFixture<PlatosComponent>;
  let mockMenuAdminService: jasmine.SpyObj<MenuAdminService>;
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const testMenuItem: MenuItem = {
    id: 1,
    name: 'Pasta Carbonara',
    description: 'Traditional Italian pasta',
    category: 'MAIN_COURSE',
    price: 12.50,
    stockQuantity: 10,
    available: true
  };

  beforeEach(async () => {
    mockMenuAdminService = jasmine.createSpyObj<MenuAdminService>('MenuAdminService', [
      'listItems',
      'createItem',
      'updateItem',
      'deleteItem'
    ]);
    mockSessionService = jasmine.createSpyObj<SessionService>('SessionService', [
      'hasRole',
      'getStoredUser'
    ]);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    mockSessionService.hasRole.and.returnValue(true);
    mockSessionService.getStoredUser.and.returnValue({
      fullName: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN'
    });

    await TestBed.configureTestingModule({
      imports: [PlatosComponent, CommonModule, ReactiveFormsModule],
      providers: [
        { provide: MenuAdminService, useValue: mockMenuAdminService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },
        FormBuilder
      ]
    })
      .overrideComponent(PlatosComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(PlatosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to mesas if not admin on init', () => {
    mockSessionService.hasRole.and.returnValue(false);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/mesas']);
  });

  it('should load menu items on init', (done) => {
    mockMenuAdminService.listItems.and.returnValue(of([testMenuItem]));
    component.ngOnInit();

    setTimeout(() => {
      expect(mockMenuAdminService.listItems).toHaveBeenCalled();
      expect(component.items.length).toBeGreaterThan(0);
      done();
    }, 50);
  });

  it('should handle load items error', (done) => {
    mockMenuAdminService.listItems.and.returnValue(throwError(() => new Error('Load error')));
    component.ngOnInit();

    setTimeout(() => {
      expect(component.errorMessage).toBeTruthy();
      done();
    }, 50);
  });

  it('should have category options', () => {
    expect(component.categoryOptions).toContain('MAIN_COURSE');
    expect(component.categoryOptions).toContain('DRINK');
    expect(component.categoryOptions).toContain('DESSERT');
  });

  it('should have category labels', () => {
    expect(component.categoryLabels['MAIN_COURSE']).toBe('Platos fuertes');
    expect(component.categoryLabels['DRINK']).toBe('Bebidas');
  });

  it('should return correct form title when creating', () => {
    component.editingItem = null;
    expect(component.formTitle).toBe('Agregar plato');
  });

  it('should return correct form title when editing', () => {
    component.editingItem = testMenuItem;
    expect(component.formTitle).toBe('Editar plato');
  });

  it('should return user name', () => {
    expect(component.userName).toBe('Admin User');
  });

  it('should mark form as touched on invalid save', () => {
    component.itemForm.reset();
    component.saveItem();
    expect(component.itemForm.touched).toBe(true);
  });
});
