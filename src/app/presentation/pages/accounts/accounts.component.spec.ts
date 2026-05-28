import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { UserAdminService } from '../../../infrastructure/services/user-admin.service';
import { SessionService } from '../../../infrastructure/services/session.service';
import { of, throwError } from 'rxjs';
import { UserAccount, AccountRole } from '../../../infrastructure/services/user-admin.service';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;
  let mockUserAdminService: jasmine.SpyObj<UserAdminService>;
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const testUser: UserAccount = {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'EMPLOYEE'
  };

  const adminUser: UserAccount = {
    id: 2,
    fullName: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN'
  };

  beforeEach(async () => {
    mockUserAdminService = jasmine.createSpyObj<UserAdminService>('UserAdminService', [
      'listUsers',
      'createUser',
      'updateRole',
      'deleteUser'
    ]);
    mockSessionService = jasmine.createSpyObj<SessionService>('SessionService', [
      'hasRole',
      'getStoredUser',
      'logout'
    ]);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    mockSessionService.hasRole.and.returnValue(true);
    mockSessionService.getStoredUser.and.returnValue({
      fullName: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN'
    });

    await TestBed.configureTestingModule({
      imports: [AccountsComponent, CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: UserAdminService, useValue: mockUserAdminService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} },
        FormBuilder
      ]
    })
      .overrideComponent(AccountsComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to historial if not admin on init', () => {
    mockSessionService.hasRole.and.returnValue(false);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/historial']);
  });

  it('should load users on init', (done) => {
    mockUserAdminService.listUsers.and.returnValue(of([testUser, adminUser]));
    component.ngOnInit();

    setTimeout(() => {
      expect(mockUserAdminService.listUsers).toHaveBeenCalled();
      expect(component.users.length).toBe(2);
      done();
    }, 50);
  });

  it('should initialize role drafts on load', (done) => {
    mockUserAdminService.listUsers.and.returnValue(of([testUser, adminUser]));
    component.ngOnInit();

    setTimeout(() => {
      expect(component.roleDrafts[testUser.id]).toBe('EMPLOYEE');
      expect(component.roleDrafts[adminUser.id]).toBe('ADMIN');
      done();
    }, 50);
  });

  it('should handle load users error', (done) => {
    mockUserAdminService.listUsers.and.returnValue(throwError(() => new Error('Load error')));
    component.ngOnInit();

    setTimeout(() => {
      expect(component.errorMessage).toBeTruthy();
      done();
    }, 50);
  });

  it('should return user name', () => {
    expect(component.userName).toBe('Admin User');
  });

  it('should return current user email', () => {
    expect(component.currentUserEmail).toBe('admin@example.com');
  });

  it('should have role options', () => {
    expect(component.roleOptions).toContain('ADMIN');
    expect(component.roleOptions).toContain('EMPLOYEE');
  });

  it('should prevent deleting own account', () => {
    component.deleteUser(adminUser);
    expect(component.errorMessage).toContain('No puedes eliminar tu propia cuenta');
  });

  it('should create account form with default role EMPLOYEE', () => {
    expect(component.accountForm.get('role')?.value).toBe('EMPLOYEE');
  });

  it('should validate required form fields', () => {
    component.accountForm.reset();
    expect(component.accountForm.valid).toBe(false);
  });

  it('should update a user role', () => {
    const updatedUser = { ...testUser, role: 'ADMIN' as AccountRole };
    component.users = [testUser];
    component.roleDrafts = { [testUser.id]: 'ADMIN' };
    mockUserAdminService.updateRole.and.returnValue(of(updatedUser));

    component.updateRole(testUser);

    expect(mockUserAdminService.updateRole).toHaveBeenCalledWith(testUser.id, 'ADMIN');
    expect(component.users[0].role).toBe('ADMIN');
    expect(component.roleDrafts[testUser.id]).toBe('ADMIN');
  });

  it('should delete a confirmed user', () => {
    spyOn(globalThis, 'confirm').and.returnValue(true);
    component.users = [testUser, adminUser];
    component.roleDrafts = { [testUser.id]: 'EMPLOYEE', [adminUser.id]: 'ADMIN' };
    mockUserAdminService.deleteUser.and.returnValue(of(void 0));

    component.deleteUser(testUser);

    expect(mockUserAdminService.deleteUser).toHaveBeenCalledWith(testUser.id);
    expect(component.users).toEqual([adminUser]);
    expect(component.roleDrafts[testUser.id]).toBeUndefined();
  });

  it('should not delete a user when confirmation is cancelled', () => {
    spyOn(globalThis, 'confirm').and.returnValue(false);

    component.deleteUser(testUser);

    expect(mockUserAdminService.deleteUser).not.toHaveBeenCalled();
  });

  it('should create a user with trimmed form values', () => {
    const createdUser: UserAccount = {
      id: 3,
      fullName: 'Alice User',
      email: 'alice@example.com',
      role: 'EMPLOYEE'
    };
    mockUserAdminService.createUser.and.returnValue(of(createdUser));
    component.accountForm.setValue({
      fullName: 'Alice User',
      email: 'alice@example.com',
      password: 'Secret123!',
      role: 'EMPLOYEE'
    });

    component.createUser();

    expect(mockUserAdminService.createUser).toHaveBeenCalledWith({
      fullName: 'Alice User',
      email: 'alice@example.com',
      password: 'Secret123!',
      role: 'EMPLOYEE'
    });
    expect(component.users).toEqual([createdUser]);
    expect(component.roleDrafts[createdUser.id]).toBe('EMPLOYEE');
  });

  it('should mark invalid create form and show password guidance', () => {
    component.accountForm.setValue({
      fullName: 'Al',
      email: 'invalid-email',
      password: 'weak',
      role: 'EMPLOYEE'
    });

    component.createUser();

    expect(mockUserAdminService.createUser).not.toHaveBeenCalled();
    expect(component.errorMessage).toContain('contrasena');
  });

  it('should format roles and identify the current user', () => {
    expect(component.formatRole('ADMIN')).toBe('Administrador');
    expect(component.formatRole('EMPLOYEE')).toBe('Empleado');
    expect(component.trackByUserId(0, testUser)).toBe(testUser.id);
    expect(component.isCurrentUser(adminUser)).toBeTrue();
    expect(component.isCurrentUser(testUser)).toBeFalse();
  });

  it('should logout and navigate home', () => {
    component.logout();

    expect(mockSessionService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
