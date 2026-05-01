import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginUseCase } from '../../../../application/use-cases/auth/login.use-case';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private loginUseCase: LoginUseCase,
    private router: Router
  ) {}

  submit(): void {
    this.errorMessage = '';
    if (!this.credentials.email.trim() || !this.credentials.password.trim()) {
      this.errorMessage = 'Completa correo y contraseña.';
      return;
    }

    this.isSubmitting = true;
    this.loginUseCase.execute(this.credentials.email, this.credentials.password).subscribe({
      next: () => this.router.navigate(['/mesas']),
      error: () => {
        this.errorMessage = 'No se pudo iniciar sesión. Verifica tus datos.';
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false)
    });
  }
}