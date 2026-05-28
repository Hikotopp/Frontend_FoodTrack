import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MenuAdminService } from './menu-admin.service';
import { MenuItem, MenuCategory } from '../../domain/entities/table.entity';
import { environment } from '../../../environments/environment';

describe('MenuAdminService', () => {
  let service: MenuAdminService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/menu-items`;

  const testMenuItem: MenuItem = {
    id: 1,
    name: 'Pasta',
    description: 'Italian pasta',
    category: 'MAIN_COURSE',
    price: 12.50,
    stockQuantity: 10,
    available: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MenuAdminService]
    });

    service = TestBed.inject(MenuAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list items', () => {
    service.listItems().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0]).toEqual(testMenuItem);
    });

    const req = httpMock.expectOne(`${apiUrl}/admin`);
    expect(req.request.method).toBe('GET');
    req.flush([testMenuItem]);
  });

  it('should create item', () => {
    const payload = {
      name: 'Pasta',
      description: 'Italian pasta',
      category: 'MAIN_COURSE' as MenuCategory,
      price: 12.50,
      stockQuantity: 10
    };

    service.createItem(payload).subscribe((item) => {
      expect(item).toEqual(testMenuItem);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(testMenuItem);
  });

  it('should update item', () => {
    const payload = {
      name: 'Updated Pasta',
      description: 'Updated Italian pasta',
      category: 'MAIN_COURSE' as MenuCategory,
      price: 15.00,
      stockQuantity: 20,
      active: true
    };

    const updatedItem = { ...testMenuItem, ...payload };

    service.updateItem(1, payload).subscribe((item) => {
      expect(item.name).toBe('Updated Pasta');
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(updatedItem);
  });

  it('should delete item', () => {
    service.deleteItem(1).subscribe(() => {
      expect(true).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error on list items', () => {
    service.listItems().subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/admin`);
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });
});
