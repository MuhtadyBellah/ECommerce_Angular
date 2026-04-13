import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderData } from '../../core/models/order.interface';
import { AuthService } from '../../core/services/auth/auth.service';
import { OrderService } from '../../core/services/order/order.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, PageHeaderComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);

  private readonly currentUser = this.authService.currentUser;

  readonly orders = signal<OrderData[]>([]);
  showDetails = signal<boolean>(false);

  ngOnInit(): void {
    this.getUserOrders();
  }

  private getUserOrders(): void {
    this.orderService.getUserOrders(this.currentUser()!._id).subscribe({
      next: (res) => {
        this.orders.set(res.data);
      },
      error: () => {},
    });
  }

  toggleDetails(): void {
    this.showDetails.set(!this.showDetails());
  }
}
