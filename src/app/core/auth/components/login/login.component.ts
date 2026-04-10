import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { AuthService } from '../../../services/auth/auth.service';
import { loginRequest } from './../../../models/request.interface';

@Component({
  selector: 'app-login',
  imports: [AlertComponent, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly formBuild = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  loginForm!: FormGroup;

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal('');

  readonly isSubmitDisabled = computed(() => this.isLoading());

  ngOnInit(): void {
    this.loginForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(environment.PASSWORD_PATTERN)]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    const loginRequest: loginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.authService
      .postLogin(loginRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          if (error.status === 400) {
            this.errorMessage.set('Incorrect email or password');
          } else if (error.status === 401) {
            this.errorMessage.set('Invalid credentials');
          } else if (error.status === 0) {
            this.errorMessage.set('Unable to connect to server. Please check your connection.');
          } else {
            this.errorMessage.set('Login failed. Please try again.');
          }
        },
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
}
