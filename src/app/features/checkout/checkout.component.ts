import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { orderRequest } from '../../core/models/request.interface';
import { OrderService } from '../../core/services/order/order.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';

@Component({
  selector: 'app-checkout',
  imports: [AlertComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuild = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  checkoutForm!: FormGroup;

  readonly isLoading = signal(false);
  readonly isCash = signal(true);
  readonly errorMessage = signal('');

  readonly isSubmitDisabled = computed(() => this.isLoading());

  ngOnInit(): void {
    this.checkoutForm = this.formBuild.group({
      details: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(environment.PHONE_EG)]],
      city: ['', [Validators.required]],
    });
  }

  changePaymentMethod(): void {
    this.isCash.set(!this.isCash());
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.isCash()) {
      this.placeOrder();
    } else {
      this.visaOrder();
    }
  }

  private placeOrder(): void {
    const cartId = this.activatedRoute.snapshot.paramMap.get('id');

    this.errorMessage.set('');
    this.isLoading.set(true);

    const checkoutRequest: orderRequest = {
      shippingAddress: {
        details: this.checkoutForm.value,
        phone: this.checkoutForm.value,
        city: this.checkoutForm.value,
      },
    };

    this.orderService
      .postOrder(cartId!, checkoutRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.router.navigate(['/orderorders']);
          }
        },
        error: () => {},
      });
  }

  private visaOrder(): void {
    const cartId = this.activatedRoute.snapshot.paramMap.get('id');

    this.errorMessage.set('');
    this.isLoading.set(true);

    const checkoutRequest: orderRequest = {
      shippingAddress: {
        details: this.checkoutForm.value,
        phone: this.checkoutForm.value,
        city: this.checkoutForm.value,
      },
    };

    this.orderService
      .postVisaOrder(cartId!, checkoutRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            window.open(res.session.url, '_self');
          }
        },
        error: () => {},
      });
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    if (field.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    return '';
  }
}
