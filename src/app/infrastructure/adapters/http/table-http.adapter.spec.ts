import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TableHttpAdapter } from './table-http.adapter';
import { environment } from '../../../../environments/environment';
import { TableDashboard, TableSummary } from '../../../domain/entities/table.entity';

describe('TableHttpAdapter', () => {
  let adapter: TableHttpAdapter;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/tables`;

  const tableSummary: TableSummary = {
    id: 1,
    tableNumber: 4,
    status: 'AVAILABLE',
    total: 0,
    itemCount: 0
  };

  const dashboard: TableDashboard = {
    table: { id: 1, tableNumber: 4, status: 'OCCUPIED' },
    currentOrder: null,
    menuItems: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TableHttpAdapter]
    });

    adapter = TestBed.inject(TableHttpAdapter);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists tables', () => {
    adapter.listTables().subscribe((tables) => expect(tables).toEqual([tableSummary]));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([tableSummary]);
  });

  it('loads a table dashboard', () => {
    adapter.getTableDashboard(1).subscribe((response) => expect(response).toEqual(dashboard));

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dashboard);
  });

  it('creates a table', () => {
    adapter.createTable(4).subscribe((response) => expect(response).toEqual(tableSummary));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ tableNumber: 4 });
    req.flush(tableSummary);
  });

  it('deletes a table', () => {
    adapter.deleteTable(1).subscribe((response) => expect(response).toBeNull());

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('updates table status', () => {
    adapter.updateTableStatus(1, 'CLEANING').subscribe((response) => expect(response.status).toBe('AVAILABLE'));

    const req = httpMock.expectOne(`${apiUrl}/1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'CLEANING' });
    req.flush(tableSummary);
  });

  it('adds an order line', () => {
    adapter.addOrderLine(1, 9, 2).subscribe((response) => expect(response).toEqual(dashboard));

    const req = httpMock.expectOne(`${apiUrl}/1/order-lines`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ menuItemId: 9, quantity: 2 });
    req.flush(dashboard);
  });

  it('updates an order line', () => {
    adapter.updateOrderLine(1, 5, 3).subscribe((response) => expect(response).toEqual(dashboard));

    const req = httpMock.expectOne(`${apiUrl}/1/order-lines/5`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ quantity: 3 });
    req.flush(dashboard);
  });

  it('removes an order line', () => {
    adapter.removeOrderLine(1, 5).subscribe((response) => expect(response).toEqual(dashboard));

    const req = httpMock.expectOne(`${apiUrl}/1/order-lines/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dashboard);
  });

  it('closes an order', () => {
    adapter.closeOrder(1).subscribe((response) => expect(response).toEqual(dashboard));

    const req = httpMock.expectOne(`${apiUrl}/1/close-order`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(dashboard);
  });
});
