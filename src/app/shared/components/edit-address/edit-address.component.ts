import {
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AddressData } from '../../../core/models/address.interface';
import { AddressesService } from '../../../core/services/addresses/addresses.service';
import { addressRequest } from './../../../core/models/request.interface';

@Component({
  selector: 'app-edit-address',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-address.component.html',
  styleUrl: './edit-address.component.css',
})
export class EditAddressComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuild = inject(FormBuilder);
  private readonly addressesService = inject(AddressesService);
  private readonly router = inject(Router);

  @HostListener('document:keydown.escape')
  onEsc() {
    this.onClose();
  }

  addressForm!: FormGroup;

  address = input<AddressData | null>(null);
  mode = input.required<'add' | 'edit'>();
  close = output<void>();

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  readonly isSubmitDisabled = computed(() => this.isLoading());

  ngOnInit(): void {
    this.addressForm = this.formBuild.group({
      name: ['', [Validators.required]],
      details: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(environment.PHONE_EG)]],
      city: ['', [Validators.required]],
    });

    if (this.address) {
      this.addressForm.patchValue(this.address);
    }
  }

  onSubmit(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    const addressRequest: addressRequest = {
      city: this.addressForm.value.city,
      name: this.addressForm.value.name,
      details: this.addressForm.value.details,
      phone: this.addressForm.value.phone,
    };

    this.addressesService
      .addAddress(addressRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.router.navigate(['/profile/address']);
          }
        },
        error: () => {},
      });
  }

  onClose(): void {
    this.close.emit();
  }

  getFieldError(fieldName: string): string {
    const field = this.addressForm.get(fieldName);
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
