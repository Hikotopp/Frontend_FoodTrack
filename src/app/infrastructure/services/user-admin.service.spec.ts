import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { UserAccount, UserAdminService } from './user-admin.service';

describe('UserAdminService', () => {
  let service: UserAdminService;
  let httpMock: HttpTestingController;
  const user: UserAccount = {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserAdminService]
    });
    service = TestBed.inject(UserAdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should list users', () => {
    service.listUsers().subscribe((result) => expect(result).toEqual([user]));

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush([user]);
  });

  it('should create users', () => {
    const payload = { fullName: 'Admin User', email: 'admin@example.com', password: 'Password123!', role: 'ADMIN' as const };

    service.createUser(payload).subscribe((result) => expect(result).toEqual(user));

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(user);
  });

  it('should update user roles', () => {
    service.updateRole(1, 'EMPLOYEE').subscribe((result) => expect(result.role).toBe('EMPLOYEE'));

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1/role`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ role: 'EMPLOYEE' });
    req.flush({ ...user, role: 'EMPLOYEE' });
  });

  it('should delete users', () => {
    service.deleteUser(1).subscribe((result) => expect(result).toBeNull());

    const req = httpMock.expectOne(`${environment.apiUrl}/users/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
