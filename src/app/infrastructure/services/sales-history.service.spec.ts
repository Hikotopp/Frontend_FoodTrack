import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { SaleHistoryItem, SalesHistoryService } from './sales-history.service';

describe('SalesHistoryService', () => {
  let service: SalesHistoryService;
  let httpMock: HttpTestingController;
  const sale: SaleHistoryItem = {
    id: 1,
    tableId: 1,
    tableNumber: 3,
    createdByUserId: 2,
    createdByName: 'Cashier',
    status: 'CLOSED',
    total: 40,
    createdAt: '2026-05-28T10:00:00',
    updatedAt: '2026-05-28T10:30:00',
    lines: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SalesHistoryService]
    });
    service = TestBed.inject(SalesHistoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should list sales history', () => {
    service.listHistory().subscribe((result) => expect(result).toEqual([sale]));

    const req = httpMock.expectOne(`${environment.apiUrl}/sales/history`);
    expect(req.request.method).toBe('GET');
    req.flush([sale]);
  });

  it('should update sale status', () => {
    const updated = { ...sale, status: 'CANCELLED' as const };

    service.updateStatus(1, 'CANCELLED').subscribe((result) => expect(result).toEqual(updated));

    const req = httpMock.expectOne(`${environment.apiUrl}/sales/history/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'CANCELLED' });
    req.flush(updated);
  });
});
