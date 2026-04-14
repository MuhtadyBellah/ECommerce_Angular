import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressData } from '../../core/models/address.interface';
import { AddressesService } from '../../core/services/addresses/addresses.service';
import { EditAddressComponent } from '../../shared/components/edit-address/edit-address.component';

@Component({
  selector: 'app-profile-addresses',
  imports: [EditAddressComponent, ReactiveFormsModule],
  templateUrl: './profile-addresses.component.html',
  styleUrl: './profile-addresses.component.css',
})
export class ProfileAddressesComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly addressesService = inject(AddressesService);

  modeAddress = signal<'add' | 'edit' | null>(null);
  selectedAddress = signal<AddressData | null>(null);
  addresses = signal<AddressData[]>([]);

  ngOnInit(): void {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    this.addressesService
      .getUserAddresses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.addresses.set(res.data);
        },
        error: () => {},
      });
  }

  deleteAddress(addrssId: string): void {
    this.addressesService
      .deleteAddress(addrssId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.addresses.set(res.data);
        },
        error: () => {},
      });
  }

  onOpenAddAddress(): void {
    this.selectedAddress.set(null);
    this.modeAddress.set('add');
  }

  onOpenEditAddress(address: AddressData): void {
    this.selectedAddress.set(address);
    this.modeAddress.set('edit');
  }

  onCloseAddress(): void {
    this.modeAddress.set(null);
    this.selectedAddress.set(null);
  }
}
