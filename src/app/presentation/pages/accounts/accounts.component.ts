import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BaseDataComponent } from '../../../shared/base-data.component';
import { SessionService } from '../../../infrastructure/services/session.service';
import { AccountRole, UserAccount, UserAdminService } from '../../../infrastructure/services/user-admin.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent extends BaseDataComponent implements OnInit {
  users: UserAccount[] = [];
  roleDrafts: Record<number, AccountRole> = {};
  newUser = {
    fullName: '',
    email: '',
    password: '',
    role: 'EMPLOYEE' as AccountRole
  };
  readonly roleOptions: AccountRole[] = ['ADMIN', 'EMPLOYEE'];

  constructor(
    private userAdminService: UserAdminService,
    private sessionService: SessionService,
    private router: Router,
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

  createUser(): void {
    if (!this.newUser.fullName.trim() || !this.newUser.email.trim() || !this.newUser.password.trim()) {
      this.errorMessage = 'Completa nombre, correo y contraseña.';
      return;
    }

    this.saveData(
      this.userAdminService.createUser({
        fullName: this.newUser.fullName,
        email: this.newUser.email,
        password: this.newUser.password,
        role: this.newUser.role
      }),
      (created) => {
        this.users = [...this.users, created].sort((a, b) => a.fullName.localeCompare(b.fullName));
        this.roleDrafts[created.id] = created.role;
        this.newUser = {
          fullName: '',
          email: '',
          password: '',
          role: 'EMPLOYEE'
        };
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
}
