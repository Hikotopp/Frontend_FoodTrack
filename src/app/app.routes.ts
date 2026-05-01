import { Routes } from '@angular/router';
import { HomeComponent } from './presentation/pages/home/home.component';
import { LoginComponent } from './presentation/pages/auth/login/login.component';
import { RegisterComponent } from './presentation/pages/auth/register/register.component';
import { MesasComponent } from './presentation/pages/mesas/mesas.component';
import { MesaDetailComponent } from './presentation/pages/mesa-detail/mesa-detail.component';
import { authGuard } from './presentation/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mesas', component: MesasComponent, canActivate: [authGuard] },
  { path: 'mesas/:id', component: MesaDetailComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
