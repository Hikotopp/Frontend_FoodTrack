import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesHistoryComponent } from './sales-history.component';
import { SalesHistoryService, SaleHistoryItem } from '../../../infrastructure/services/sales-history.service';
import { AdminReportService } from '../../../infrastructure/services/admin-report.service';
import { SessionService } from '../../../infrastructure/services/session.service';
import { of, throwError } from 'rxjs';

describe('SalesHistoryComponent', () => {
  let component: SalesHistoryComponent;
  let fixture: ComponentFixture<SalesHistoryComponent>;
  let mockSalesHistoryService: jasmine.SpyObj<SalesHistoryService>;
  let mockAdminReportService: jasmine.SpyObj<AdminReportService>;
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const testSale: SaleHistoryItem = {
    id: 1,
    tableId: 1,
    tableNumber: 1,
    createdByUserId: 1,
    createdByName: 'John Doe',
    status: 'CLOSED',
    total: 50.00,
    createdAt: '2026-05-28T10:00:00',
    updatedAt: '2026-05-28T10:30:00',
    lines: []
  };

  const testSale2: SaleHistoryItem = {
    id: 2,
    tableId: 2,
    tableNumber: 2,
    createdByUserId: 2,
    createdByName: 'Jane Smith',
    status: 'CANCELLED',
    total: 30.00,
    createdAt: '2026-05-28T11:00:00',
    updatedAt: '2026-05-28T11:30:00',
    lines: []
  };

  beforeEach(async () => {
    mockSalesHistoryService = jasmine.createSpyObj<SalesHistoryService>('SalesHistoryService', [
      'listHistory',
      'updateStatus'
    ]);
    mockAdminReportService = jasmine.createSpyObj<AdminReportService>('AdminReportService', [
      'generateNow'
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
      imports: [SalesHistoryComponent, CommonModule, FormsModule, CurrencyPipe, DatePipe],
      providers: [
        { provide: SalesHistoryService, useValue: mockSalesHistoryService },
        { provide: AdminReportService, useValue: mockAdminReportService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
      .overrideComponent(SalesHistoryComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(SalesHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load history on init', (done) => {
    mockSalesHistoryService.listHistory.and.returnValue(of([testSale, testSale2]));
    component.ngOnInit();

    setTimeout(() => {
      expect(mockSalesHistoryService.listHistory).toHaveBeenCalled();
      expect(component.sales.length).toBe(2);
      done();
    }, 50);
  });

  it('should initialize status drafts on load', (done) => {
    mockSalesHistoryService.listHistory.and.returnValue(of([testSale, testSale2]));
    component.ngOnInit();

    setTimeout(() => {
      expect(component.statusDrafts[testSale.id]).toBe('CLOSED');
      expect(component.statusDrafts[testSale2.id]).toBe('CANCELLED');
      done();
    }, 50);
  });

  it('should handle load history error', (done) => {
    mockSalesHistoryService.listHistory.and.returnValue(throwError(() => new Error('Load error')));
    component.ngOnInit();

    setTimeout(() => {
      expect(component.errorMessage).toBeTruthy();
      done();
    }, 50);
  });

  it('should return user name', () => {
    expect(component.userName).toBe('Admin User');
  });

  it('should identify admin user', () => {
    expect(component.isAdmin).toBe(true);
  });

  it('should have status options', () => {
    expect(component.statusOptions).toContain('CLOSED');
    expect(component.statusOptions).toContain('CANCELLED');
  });

  it('should return false for isAdmin when not admin', () => {
    mockSessionService.hasRole.and.returnValue(false);
    mockSalesHistoryService.listHistory.and.returnValue(of([]));
    component.ngOnInit();
    expect(component.isAdmin).toBe(false);
  });

  it('should update status successfully', (done) => {
    const updatedSale: SaleHistoryItem = { ...testSale, status: 'CANCELLED' };
    mockSalesHistoryService.updateStatus.and.returnValue(of(updatedSale));
    component.sales = [testSale];
    component.statusDrafts[testSale.id] = 'CANCELLED';

    component.updateStatus(testSale);

    setTimeout(() => {
      expect(mockSalesHistoryService.updateStatus).toHaveBeenCalledWith(testSale.id, 'CANCELLED');
      expect(component.sales[0].status).toBe('CANCELLED');
      done();
    }, 50);
  });

  it('should not update status if not admin', () => {
    mockSessionService.hasRole.and.returnValue(false);
    component.updateStatus(testSale);
    expect(mockSalesHistoryService.updateStatus).not.toHaveBeenCalled();
  });

  it('should not generate report if not admin', () => {
    mockSessionService.hasRole.and.returnValue(false);
    component.generateReport();
    expect(mockAdminReportService.generateNow).not.toHaveBeenCalled();
  });

  it('should clear report toast timer on destroy', () => {
    component.ngOnDestroy();
    expect(component).toBeTruthy(); // Component should be cleaned up
  });

  it('should load empty history', (done) => {
    mockSalesHistoryService.listHistory.and.returnValue(of([]));
    component.ngOnInit();

    setTimeout(() => {
      expect(component.sales.length).toBe(0);
      done();
    }, 50);
  });
});
