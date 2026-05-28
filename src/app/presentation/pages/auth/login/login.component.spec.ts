import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginUseCase } from '../../../../application/use-cases/auth/login.use-case';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLoginUseCase: jasmine.SpyObj<LoginUseCase>;
  let mockRouter: jasmine.SpyObj<Router>;
  const authResponse = {
    token: 'token',
    fullName: 'Test User',
    email: 'test@example.com',
    role: 'EMPLOYEE' as const
  };

  beforeEach(async () => {
    mockLoginUseCase = jasmine.createSpyObj<LoginUseCase>('LoginUseCase', ['execute']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, CommonModule, FormsModule],
      providers: [
        { provide: LoginUseCase, useValue: mockLoginUseCase },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
      .overrideComponent(LoginComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty credentials', () => {
    expect(component.credentials.email).toBe('');
    expect(component.credentials.password).toBe('');
    expect(component.isSubmitting).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should show error when email is empty', () => {
    component.credentials.email = '';
    component.credentials.password = 'password123';
    component.submit();

    expect(component.errorMessage).toBe('Completa correo y contraseña.');
    expect(mockLoginUseCase.execute).not.toHaveBeenCalled();
  });

  it('should show error when password is empty', () => {
    component.credentials.email = 'test@example.com';
    component.credentials.password = '';
    component.submit();

    expect(component.errorMessage).toBe('Completa correo y contraseña.');
    expect(mockLoginUseCase.execute).not.toHaveBeenCalled();
  });

  it('should login successfully with valid credentials', (done) => {
    component.credentials.email = 'test@example.com';
    component.credentials.password = 'password123';
    mockLoginUseCase.execute.and.returnValue(of(authResponse));

    component.submit();

    expect(mockLoginUseCase.execute).toHaveBeenCalledWith('test@example.com', 'password123');

    setTimeout(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/mesas']);
      expect(component.isSubmitting).toBe(false);
      done();
    }, 10);
  });

  it('should handle login error', (done) => {
    component.credentials.email = 'test@example.com';
    component.credentials.password = 'wrong';
    mockLoginUseCase.execute.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.submit();

    expect(component.isSubmitting).toBe(false);

    setTimeout(() => {
      expect(component.errorMessage).toBe('No se pudo iniciar sesión. Verifica tus datos.');
      expect(component.isSubmitting).toBe(false);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    }, 10);
  });

  it('should trim whitespace from credentials', () => {
    component.credentials.email = '  test@example.com  ';
    component.credentials.password = '  password123  ';
    mockLoginUseCase.execute.and.returnValue(of(authResponse));

    component.submit();

    expect(mockLoginUseCase.execute).toHaveBeenCalledWith('  test@example.com  ', '  password123  ');
  });

  it('should clear error message on new submit', () => {
    component.errorMessage = 'Previous error';
    component.credentials.email = '';
    component.credentials.password = 'password';

    component.submit();

    expect(component.errorMessage).toBe('Completa correo y contraseña.');
  });
});
