import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.usuario || !this.contrasena) {
      this.error = 'Por favor ingrese usuario y contraseña';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: (response) => {
        this.authService.guardarToken(response.token);
        this.cargando = false;
        this.router.navigate(['/mesas']);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }
}