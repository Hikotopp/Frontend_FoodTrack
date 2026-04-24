import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.errorMessage = '';

    if (!this.credentials.email.trim() || !this.credentials.password.trim()) {
      this.errorMessage = 'Completa correo y contrasena.';
      return;
    }

    this.isSubmitting = true;
    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response) => {
        this.authService.saveSession(response);
        this.router.navigate(['/mesas']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'No se pudo iniciar sesion. Verifica tus datos.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
