import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MesasComponent } from './pages/mesas/mesas.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // ← Esto debe ser HomeComponent
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'mesas', component: MesasComponent },
  { path: '**', redirectTo: '/home' }
];