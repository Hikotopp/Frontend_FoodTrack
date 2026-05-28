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
});
