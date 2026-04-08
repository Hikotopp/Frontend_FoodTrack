import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MesasComponent } from './pages/mesas/mesas.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'mesas', component: MesasComponent },
  { path: '**', redirectTo: 'login' }
];