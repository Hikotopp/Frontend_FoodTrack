import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterUseCase } from '../../../../application/use-cases/auth/register.use-case';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = {
    fullName: '',
    email: '',
    password: ''
  };
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private registerUseCase: RegisterUseCase,
    private router: Router
  ) {}

  submit(): void {
    this.errorMessage = '';

    if (!this.form.fullName.trim() || !this.form.email.trim() || !this.form.password.trim()) {
      this.errorMessage = 'Completa todos los campos.';
      return;
    }

    this.isSubmitting = true;
    this.registerUseCase.execute(this.form.fullName, this.form.email, this.form.password).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'No se pudo crear la cuenta.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
