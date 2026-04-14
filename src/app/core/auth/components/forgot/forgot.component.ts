import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-forgot',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css',
})
export class ForgotComponent {
  private readonly formBuild = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  forgotForm!: FormGroup;

  readonly isLoading = signal(false);

  readonly isSubmitDisabled = computed(() => !this.forgotForm!.invalid || this.isLoading());

  private readonly validationMessages: Record<string, Record<string, string>> = {
    email: {
      required: 'Email address is required.',
      email: 'Please enter a valid email address.',
    },
  };

  ngOnInit(): void {
    this.forgotForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const { email } = this.forgotForm.value;
    this.authService
      .forgotPassword(email)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/password/reset/', email]);
        },
        error: () => {},
      });
  }

  getFieldError(fieldName: string): string {
    const field = this.forgotForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errorKey = Object.keys(field.errors)[0];
    return this.validationMessages[fieldName]?.[errorKey] || '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.forgotForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
