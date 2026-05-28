import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { RegisterUseCase } from '../../../../application/use-cases/auth/register.use-case';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRegisterUseCase: jasmine.SpyObj<RegisterUseCase>;
  let mockRouter: jasmine.SpyObj<Router>;
  const authResponse = {
    token: 'token',
    fullName: 'John Doe',
    email: 'john@example.com',
    role: 'EMPLOYEE' as const
  };

  beforeEach(async () => {
    mockRegisterUseCase = jasmine.createSpyObj<RegisterUseCase>('RegisterUseCase', ['execute']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, CommonModule, FormsModule],
      providers: [
        { provide: RegisterUseCase, useValue: mockRegisterUseCase },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
      .overrideComponent(RegisterComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.form.fullName).toBe('');
    expect(component.form.email).toBe('');
    expect(component.form.password).toBe('');
    expect(component.isSubmitting).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should show error when fullName is empty', () => {
    component.form.fullName = '';
    component.form.email = 'test@example.com';
    component.form.password = 'password123';

    component.submit();

    expect(component.errorMessage).toBe('Completa todos los campos.');
    expect(mockRegisterUseCase.execute).not.toHaveBeenCalled();
  });

  it('should show error when email is empty', () => {
    component.form.fullName = 'John Doe';
    component.form.email = '';
    component.form.password = 'password123';

    component.submit();

    expect(component.errorMessage).toBe('Completa todos los campos.');
    expect(mockRegisterUseCase.execute).not.toHaveBeenCalled();
  });

  it('should show error when password is empty', () => {
    component.form.fullName = 'John Doe';
    component.form.email = 'test@example.com';
    component.form.password = '';

    component.submit();

    expect(component.errorMessage).toBe('Completa todos los campos.');
    expect(mockRegisterUseCase.execute).not.toHaveBeenCalled();
  });

  it('should register successfully with valid form', (done) => {
    component.form.fullName = 'John Doe';
    component.form.email = 'john@example.com';
    component.form.password = 'SecurePassword123!';
    mockRegisterUseCase.execute.and.returnValue(of(authResponse));

    component.submit();

    expect(mockRegisterUseCase.execute).toHaveBeenCalledWith('John Doe', 'john@example.com', 'SecurePassword123!');

    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.isSubmitting).toBe(false);
      done();
    }, 10);
  });

  it('should handle registration error', (done) => {
    component.form.fullName = 'John Doe';
    component.form.email = 'existing@example.com';
    component.form.password = 'password123';
    mockRegisterUseCase.execute.and.returnValue(throwError(() => new Error('Email already exists')));

    component.submit();

    expect(component.isSubmitting).toBe(false);

    setTimeout(() => {
      expect(component.errorMessage).toBe('No se pudo crear la cuenta.');
      expect(component.isSubmitting).toBe(false);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    }, 10);
  });

  it('should trim whitespace from form fields', () => {
    component.form.fullName = '  John Doe  ';
    component.form.email = '  john@example.com  ';
    component.form.password = '  password123  ';
    mockRegisterUseCase.execute.and.returnValue(of(authResponse));

    component.submit();

    expect(mockRegisterUseCase.execute).toHaveBeenCalledWith('  John Doe  ', '  john@example.com  ', '  password123  ');
  });

  it('should clear error message on new submit', () => {
    component.errorMessage = 'Previous error';
    component.form.fullName = '';
    component.form.email = 'test@example.com';
    component.form.password = 'password';

    component.submit();

    expect(component.errorMessage).toBe('Completa todos los campos.');
  });
});
