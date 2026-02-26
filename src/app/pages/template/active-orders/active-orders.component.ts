import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { OrderService } from 'src/app/services/order/order.service';
import { CommonResponse } from 'src/app/models/CommonResponse';

export interface Order {
  orderId: number;
  userId: number;
  username: string | null;
  fullName: string | null;
  email: string | null;
  mobileNo: string | null;
  address: string | null;
  city: string | null;
  scheduleTime: string | null;
  orderDate: string;
  totalAmount: number;
  status: string;
  createdUser: string;
  lastUpdatedUser: string;
  createdTime: string;
  lastUpdatedTime: string;
  orderDetails: any | null;
}

@Component({
  selector: 'app-active-orders',
  templateUrl: './active-orders.component.html',
  styleUrls: ['./active-orders.component.scss']
})
export class ActiveOrdersComponent implements OnInit {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading: boolean = true;
  activeFilter: string = 'all';

  constructor(
    private router: Router,
    private location: Location,
    private storageService: StorageService,
    private toastService: ToastServiceService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    const userId = this.storageService.getUser();

    if (!userId) {
      this.toastService.errorMessage('User not found. Please login again.');
      this.router.navigate(['/auth/signin']);
      return;
    }

    this.orderService.getUserOrderDetails(userId).subscribe(
      (response: CommonResponse) => {
        this.isLoading = false;
        
        if (response.data && Array.isArray(response.data)) {
          this.allOrders = response.data;
          // Sort by order date (newest first)
          this.allOrders.sort((a, b) => 
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          );
          this.filteredOrders = [...this.allOrders];
        } else {
          this.allOrders = [];
          this.filteredOrders = [];
        }
      },
      error => {
        this.isLoading = false;
        console.error('Error loading orders:', error);
        this.toastService.errorMessage('Failed to load orders');
        this.allOrders = [];
        this.filteredOrders = [];
      }
    );
  }

  filterOrders(filter: string): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredOrders = [...this.allOrders];
    } else {
      this.filteredOrders = this.allOrders.filter(order => 
        order.status.toLowerCase() === filter.toLowerCase()
      );
    }
  }

  getStatusCount(status: string): number {
    return this.allOrders.filter(order => order.status.toLowerCase() === status.toLowerCase()).length;
  }

  getPendingCount(): number {
    return this.getStatusCount('pending');
  }

  getCanceledCount(): number {
    return this.getStatusCount('canceled');
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    return `status-${statusLower}`;
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Out for Delivery',
      'completed': 'Delivered',
      'canceled': 'Canceled'
    };
    return statusMap[status.toLowerCase()] || status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  }

  formatAmount(amount: number): string {
    return amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  calculateTotalAmount(): string {
    const total = this.filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    return this.formatAmount(total);
  }

  getEmptyStateMessage(): string {
    switch (this.activeFilter) {
      case 'pending':
        return 'You have no pending orders at the moment.';
      case 'processing':
        return 'No orders are currently being processed.';
      case 'shipped':
        return 'No orders are currently out for delivery.';
      case 'completed':
        return 'You have no completed orders yet.';
      case 'canceled':
        return 'You have no canceled orders.';
      default:
        return 'You haven\'t placed any orders yet. Start shopping now!';
    }
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/delivery/order-details', orderId]);
  }

  cancelOrder(orderId: number): void {
    // if (confirm('Are you sure you want to cancel this order?')) {
    //   this.orderService.cancelOrder(orderId).subscribe(
    //     (response: CommonResponse) => {
    //       if (response.status === 'SUCCESS') {
    //         this.toastService.successMessage('Order canceled successfully');
    //         this.loadOrders(); // Reload orders
    //       } else {
    //         this.toastService.errorMessage(response.responseDescription || 'Failed to cancel order');
    //       }
    //     },
    //     error => {
    //       console.error('Error canceling order:', error);
    //       this.toastService.errorMessage('Failed to cancel order. Please try again.');
    //     }
    //   );
    // }
  }

  navigateToHome(): void {
    this.router.navigate(['/delivery/home']);
  }

  goBack(): void {
    this.location.back();
  }
}