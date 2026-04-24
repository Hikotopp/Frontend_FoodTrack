import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { MesasComponent } from './pages/mesas/mesas.component';
import { MesaDetailComponent } from './pages/mesa-detail/mesa-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mesas', component: MesasComponent, canActivate: [authGuard] },
  { path: 'mesas/:id', component: MesaDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
