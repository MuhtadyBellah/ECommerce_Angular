import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { PasswordStrengthComponent } from '../../../../shared/components/password-strength/password-strength.component';
import { resetPasswordRequest } from '../../../models/request.interface';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-confirm',
  imports: [ReactiveFormsModule, CommonModule, PasswordStrengthComponent],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css',
})
export class ConfirmComponent {
  private readonly formBuild = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  confirmForm!: FormGroup;

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  readonly isSubmitDisabled = computed(() => !this.confirmForm?.invalid || this.isLoading());

  private readonly validationMessages: Record<string, Record<string, string>> = {
    email: {
      required: 'Email address is required.',
      email: 'Please enter a valid email address.',
    },
    newPassword: {
      required: 'Password is required.',
      minlength: 'Password must be at least 8 characters long.',
      pattern: 'Password must contain uppercase, lowercase, number, and special character.',
    },
  };

  ngOnInit(): void {
    this.confirmForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(environment.PASSWORD_PATTERN),
        ],
      ],
    });
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (!this.confirmForm) return errors;

    Object.entries(this.confirmForm.controls).forEach(([key, control]) => {
      if (control.invalid && (control.dirty || control.touched || this.isLoading())) {
        Object.keys(control.errors || {}).forEach((errorKey) => {
          const message = this.validationMessages[key]?.[errorKey];
          if (message && !errors.includes(message)) {
            errors.push(message);
          }
        });
      }
    });

    return errors;
  }

  onSubmit(): void {
    if (this.confirmForm.invalid) {
      this.confirmForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const resetRequest: resetPasswordRequest = this.confirmForm.value;

    this.authService
      .putResetPassword(resetRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {},
        error: () => {},
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  getFieldError(fieldName: string): string {
    const field = this.confirmForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errorKey = Object.keys(field.errors)[0];
    return this.validationMessages[fieldName]?.[errorKey] || '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.confirmForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
