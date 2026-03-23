import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-reset',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css',
})
export class ResetComponent {
  private readonly formBuild = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.authService.currentUser;

  resetForm!: FormGroup;

  readonly isLoading = signal(false);

  readonly isSubmitDisabled = computed(() => this.resetForm?.invalid || this.isLoading());

  private readonly validationMessages: Record<string, Record<string, string>> = {
    resetCode: {
      required: 'Code is required.',
      pattern: 'Please enter a valid 6 digits.',
    },
  };

  ngOnInit(): void {
    this.resetForm = this.formBuild.group({
      resetCode: ['', [Validators.required, Validators.pattern('/^(?=.*\d).{6,}$/')]],
    });
  }

  resendCode(): void {
    this.isLoading.set(true);

    this.authService
      .forgotPassword(this.currentUser()?.email || '')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {},
        error: () => {},
      });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService
      .verifyResetCode(this.resetForm.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: () => {},
        error: () => {},
      });
  }

  getFieldError(fieldName: string): string {
    const field = this.resetForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errorKey = Object.keys(field.errors)[0];
    return this.validationMessages[fieldName]?.[errorKey] || '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
