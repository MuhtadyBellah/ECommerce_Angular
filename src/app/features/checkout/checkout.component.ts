import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AddressData } from '../../core/models/address.interface';
import { CartData } from '../../core/models/cart.interface';
import { AddressesService } from '../../core/services/addresses/addresses.service';
import { CartService } from '../../core/services/cart/cart.service';
import { OrderService } from '../../core/services/order/order.service';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { orderRequest } from './../../core/models/request.interface';

@Component({
  selector: 'app-checkout',
  imports: [AlertComponent, ReactiveFormsModule, CommonModule, PageHeaderComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuild = inject(FormBuilder);
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly addressesService = inject(AddressesService);
  private readonly cartService = inject(CartService);

  checkoutForm!: FormGroup;

  readonly isLoading = signal(false);
  readonly isCash = signal(true);
  readonly errorMessage = signal('');
  readonly addresses = signal<AddressData[]>([]);
  readonly isaddAddress = signal<boolean>(false);
  readonly selectedAddress = signal<AddressData | null>(null);

  cart = signal<CartData | null>(null);

  readonly FREE_SHIPPING_THRESHOLD = 500;
  readonly SHIPPING_COST = 50;

  readonly isSubmitDisabled = computed(() => this.isLoading());

  readonly shippingProgress = computed(() => {
    const cartTotal = this.cart()?.totalCartPrice || 0;
    const progress = (cartTotal / this.FREE_SHIPPING_THRESHOLD) * 100;
    return Math.min(progress, 100);
  });

  readonly amountForFreeShipping = computed(() => {
    const cartTotal = this.cart()?.totalCartPrice || 0;
    return Math.max(0, this.FREE_SHIPPING_THRESHOLD - cartTotal);
  });

  readonly hasFreeShipping = computed(() => {
    const cartTotal = this.cart()?.totalCartPrice || 0;
    return cartTotal >= this.FREE_SHIPPING_THRESHOLD;
  });

  readonly totalWithShipping = computed(() => {
    const cartTotal = this.cart()?.totalCartPrice || 0;
    return this.hasFreeShipping() ? cartTotal : cartTotal + this.SHIPPING_COST;
  });

  ngOnInit(): void {
    this.getUserCart();
    this.checkoutForm = this.formBuild.group({
      details: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(environment.PHONE_EG)]],
      city: ['', [Validators.required]],
    });
    this.loadAddresses();
  }

  private getUserCart(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.cartService
      .getUserCart()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.cart.set(res.data);
        },
        error: (err) => {
          console.error('Failed to load cart:', err);
          this.errorMessage.set('Failed to load your cart. Please try again later.');
        },
      });
  }

  private loadAddresses(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.addressesService
      .getUserAddresses()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (res) => {
          this.addresses.set(res.data);
        },
        error: (error) => {
          this.errorMessage.set(error);
        },
      });
  }

  changePaymentMethod(): void {
    this.isCash.set(!this.isCash());
  }

  selectAddress(address: AddressData): void {
    this.selectedAddress.set(address);
    this.isaddAddress.set(false);

    this.checkoutForm.patchValue({
      city: address.city,
      details: address.details,
      phone: address.phone,
    });
  }

  useNewAddress(): void {
    this.selectedAddress.set(null);
    this.isaddAddress.set(true);
    this.checkoutForm.reset();
  }

  onSubmit(): void {
    if (!this.isaddAddress() && !this.selectedAddress()) {
      this.errorMessage.set('Please select a shipping address or add a new one');
      return;
    }

    if (this.isaddAddress() && this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    let shippingAddress: any;

    if (this.selectedAddress()) {
      const address = this.selectedAddress()!;
      shippingAddress = {
        details: address.details,
        phone: address.phone,
        city: address.city,
      };
    } else {
      shippingAddress = {
        details: this.checkoutForm.value.details,
        phone: this.checkoutForm.value.phone,
        city: this.checkoutForm.value.city,
      };
    }

    const checkoutRequest: orderRequest = {
      shippingAddress,
    };

    if (this.isCash()) {
      this.placeOrder(checkoutRequest);
    } else {
      this.visaOrder(checkoutRequest);
    }
  }

  private placeOrder(checkoutRequest: orderRequest): void {
    const cartId = this.activatedRoute.snapshot.paramMap.get('id');

    this.errorMessage.set('');
    this.isLoading.set(true);

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
            this.router.navigate(['/orders']);
          }
        },
        error: () => {},
      });
  }

  private visaOrder(checkoutRequest: orderRequest): void {
    const cartId = this.activatedRoute.snapshot.paramMap.get('id');

    this.errorMessage.set('');
    this.isLoading.set(true);

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
