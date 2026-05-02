import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BaseDataComponent } from '../../../shared/base-data.component';
import { SessionService } from '../../../infrastructure/services/session.service';
import { AccountRole, UserAccount, UserAdminService } from '../../../infrastructure/services/user-admin.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent extends BaseDataComponent implements OnInit {
  users: UserAccount[] = [];
  roleDrafts: Record<number, AccountRole> = {};
  private readonly passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,64}$/;
  readonly roleOptions: AccountRole[] = ['ADMIN', 'EMPLOYEE'];
  readonly accountForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordStrengthValidator.bind(this)]],
    role: ['EMPLOYEE' as AccountRole, [Validators.required]]
  });

  constructor(
    private userAdminService: UserAdminService,
    private sessionService: SessionService,
    private router: Router,
    private formBuilder: FormBuilder,
    cdr: ChangeDetectorRef
  ) {
    super(cdr);
  }

  ngOnInit(): void {
    if (!this.sessionService.hasRole('ADMIN')) {
      this.router.navigate(['/historial']);
      return;
    }
    this.loadUsers();
  }

  get userName(): string {
    return this.sessionService.getStoredUser()?.fullName ?? '';
  }

  get currentUserEmail(): string {
    return this.sessionService.getStoredUser()?.email ?? '';
  }

  loadUsers(): void {
    this.loadData(
      this.userAdminService.listUsers(),
      (users) => {
        this.users = users;
        this.roleDrafts = Object.fromEntries(users.map(user => [user.id, user.role]));
      },
      'No se pudieron cargar las cuentas.'
    );
  }

  updateRole(user: UserAccount): void {
    const role = this.roleDrafts[user.id] ?? user.role;
    this.saveData(
      this.userAdminService.updateRole(user.id, role),
      (updated) => {
        this.users = this.users.map(item => item.id === updated.id ? updated : item);
        this.roleDrafts[updated.id] = updated.role;
      },
      'No se pudo actualizar el tipo de cuenta.'
    );
  }

  deleteUser(user: UserAccount): void {
    if (user.email === this.currentUserEmail) {
      this.errorMessage = 'No puedes eliminar tu propia cuenta desde esta sesion.';
      return;
    }

    const confirmed = window.confirm(`Eliminar la cuenta de ${user.fullName}?`);
    if (!confirmed) {
      return;
    }

    this.saveData(
      this.userAdminService.deleteUser(user.id),
      () => {
        this.users = this.users.filter(item => item.id !== user.id);
        delete this.roleDrafts[user.id];
      },
      'No se pudo eliminar la cuenta.'
    );
  }

  createUser(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      this.errorMessage = this.accountForm.controls.password.invalid
        ? 'La contrasena debe tener entre 8 y 64 caracteres, una mayuscula, un numero y un caracter especial.'
        : 'Completa nombre, correo y contrasena con datos validos.';
      return;
    }

    const { fullName, email, password, role } = this.accountForm.getRawValue();

    this.saveData(
      this.userAdminService.createUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        role
      }),
      (created) => {
        this.users = [...this.users, created].sort((a, b) => a.fullName.localeCompare(b.fullName));
        this.roleDrafts[created.id] = created.role;
        this.accountForm.reset({ fullName: '', email: '', password: '', role: 'EMPLOYEE' });
      },
      'No se pudo crear la cuenta.'
    );
  }

  logout(): void {
    this.sessionService.logout();
    this.router.navigate(['/']);
  }

  formatRole(role: AccountRole): string {
    return role === 'ADMIN' ? 'Administrador' : 'Empleado';
  }

  trackByUserId(_: number, user: UserAccount): number {
    return user.id;
  }

  isCurrentUser(user: UserAccount): boolean {
    return user.email === this.currentUserEmail;
  }

  private passwordStrengthValidator(control: AbstractControl<string>): ValidationErrors | null {
    const value = control.value.trim();
    return this.passwordPattern.test(value) ? null : { passwordStrength: true };
  }
}
