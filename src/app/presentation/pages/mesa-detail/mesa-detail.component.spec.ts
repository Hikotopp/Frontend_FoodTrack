import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MesaDetailComponent } from './mesa-detail.component';
import { SessionService } from '../../../infrastructure/services/session.service';
import { GetDashboardUseCase } from '../../../application/use-cases/tables/get-dashboard.use-case';
import { UpdateTableStatusUseCase } from '../../../application/use-cases/tables/update-table-status.use-case';
import { AddOrderLineUseCase } from '../../../application/use-cases/tables/add-order-line.use-case';
import { UpdateOrderLineUseCase } from '../../../application/use-cases/tables/update-order-line.use-case';
import { RemoveOrderLineUseCase } from '../../../application/use-cases/tables/remove-order-line.use-case';
import { CloseOrderUseCase } from '../../../application/use-cases/tables/close-order.use-case';
import { of, throwError } from 'rxjs';
import { TableDashboard } from '../../../domain/entities/table.entity';

describe('MesaDetailComponent', () => {
  let component: MesaDetailComponent;
  let fixture: ComponentFixture<MesaDetailComponent>;
  let mockGetDashboardUseCase: jasmine.SpyObj<GetDashboardUseCase>;
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  const testDashboard: TableDashboard = {
    table: { id: 1, tableNumber: 1, status: 'AVAILABLE' },
    currentOrder: null,
    menuItems: []
  };

  beforeEach(async () => {
    mockGetDashboardUseCase = jasmine.createSpyObj<GetDashboardUseCase>('GetDashboardUseCase', ['execute']);
    mockSessionService = jasmine.createSpyObj<SessionService>('SessionService', [
      'hasRole',
      'getStoredUser'
    ]);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1')
        }
      }
    };

    mockSessionService.getStoredUser.and.returnValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      role: 'EMPLOYEE'
    });

    const mockUseCases = {
      provide: UpdateTableStatusUseCase,
      useValue: jasmine.createSpyObj('UpdateTableStatusUseCase', ['execute'])
    };

    await TestBed.configureTestingModule({
      imports: [MesaDetailComponent, CommonModule, FormsModule],
      providers: [
        { provide: GetDashboardUseCase, useValue: mockGetDashboardUseCase },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: UpdateTableStatusUseCase, useValue: jasmine.createSpyObj('UpdateTableStatusUseCase', ['execute']) },
        { provide: AddOrderLineUseCase, useValue: jasmine.createSpyObj('AddOrderLineUseCase', ['execute']) },
        { provide: UpdateOrderLineUseCase, useValue: jasmine.createSpyObj('UpdateOrderLineUseCase', ['execute']) },
        { provide: RemoveOrderLineUseCase, useValue: jasmine.createSpyObj('RemoveOrderLineUseCase', ['execute']) },
        { provide: CloseOrderUseCase, useValue: jasmine.createSpyObj('CloseOrderUseCase', ['execute']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MesaDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract table id from route', () => {
    mockGetDashboardUseCase.execute.and.returnValue(of(testDashboard));
    component.ngOnInit();
    expect(component.tableId).toBe(1);
  });

  it('should show error for invalid table id', () => {
    mockActivatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue('invalid');
    component.ngOnInit();
    expect(component.errorMessage).toBeTruthy();
  });

  it('should load dashboard on init', (done) => {
    mockGetDashboardUseCase.execute.and.returnValue(of(testDashboard));
    component.ngOnInit();

    setTimeout(() => {
      expect(mockGetDashboardUseCase.execute).toHaveBeenCalledWith(1);
      expect(component.dashboard).not.toBeNull();
      done();
    }, 50);
  });

  it('should return user name', () => {
    expect(component.userName).toBe('John Doe');
  });

  it('should return user role', () => {
    expect(component.userRole).toBe('EMPLOYEE');
  });

  it('should have category labels', () => {
    expect(component.categoryLabels['MAIN_COURSE']).toBe('Platos fuertes');
    expect(component.categoryLabels['DRINK']).toBe('Bebidas');
  });

  it('should have status options', () => {
    expect(component.statusOptions).toContain('AVAILABLE');
    expect(component.statusOptions).toContain('OCCUPIED');
    expect(component.statusOptions).toContain('CLEANING');
  });

  it('should return empty order lines when no current order', () => {
    component.dashboard = testDashboard;
    expect(component.orderLines).toEqual([]);
  });
});
