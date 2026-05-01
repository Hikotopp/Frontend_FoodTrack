import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/pages/home/home.component';
import { LoginComponent } from './presentation/pages/auth/login/login.component';
import { RegisterComponent } from './presentation/pages/auth/register/register.component';
import { MesasComponent } from './presentation/pages/mesas/mesas.component';
import { MesaDetailComponent } from './presentation/pages/mesa-detail/mesa-detail.component';
import { SalesHistoryComponent } from './presentation/pages/sales-history/sales-history.component';
import { AccountsComponent } from './presentation/pages/accounts/accounts.component';
import { authGuard } from './presentation/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mesas', component: MesasComponent, canActivate: [authGuard] },
  { path: 'mesas/:id', component: MesaDetailComponent, canActivate: [authGuard] },
  { path: 'historial', component: SalesHistoryComponent, canActivate: [authGuard] },
  { path: 'cuentas', component: AccountsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' }
];
