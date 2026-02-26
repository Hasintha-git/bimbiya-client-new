import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { OrderService } from 'src/app/services/order/order.service';
import { CommonResponse } from 'src/app/models/CommonResponse';

export interface OrderDetails {
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
  orderDetails: OrderItem[] | null;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {
  orderDetails: OrderDetails | null = null;
  isLoading: boolean = true;
  orderId: number = 0;

  // Status flow order
  statusFlow = ['pending', 'processing', 'shipped', 'completed'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private storageService: StorageService,
    private toastService: ToastServiceService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    // Get order ID from route params
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      if (this.orderId) {
        this.loadOrderDetails();
      } else {
        this.isLoading = false;
      }
    });
  }

  loadOrderDetails(): void {
    this.isLoading = true;

    this.orderService.getOrderById(this.orderId).subscribe(
      (response: CommonResponse) => {
        this.isLoading = false;
        
        if (response.data) {
          this.orderDetails = response.data;
        } else {
          this.orderDetails = null;
          this.toastService.errorMessage('Order not found');
        }
      },
      error => {
        this.isLoading = false;
        console.error('Error loading order details:', error);
        this.toastService.errorMessage('Failed to load order details');
        this.orderDetails = null;
      }
    );
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

  isStatusActive(status: string): boolean {
    if (!this.orderDetails) return false;
    return this.orderDetails.status.toLowerCase() === status.toLowerCase();
  }

  isStatusCompleted(status: string): boolean {
    if (!this.orderDetails) return false;
    
    const currentStatus = this.orderDetails.status.toLowerCase();
    
    // Canceled orders don't complete any steps
    if (currentStatus === 'canceled') {
      return false;
    }
    
    const currentIndex = this.statusFlow.indexOf(currentStatus);
    const checkIndex = this.statusFlow.indexOf(status.toLowerCase());
    
    return checkIndex < currentIndex || currentStatus === status.toLowerCase();
  }

  isLastStatus(status: string): boolean {
    if (!this.orderDetails) return false;
    
    const currentStatus = this.orderDetails.status.toLowerCase();
    
    // If canceled, it's the last status
    if (currentStatus === 'canceled') {
      return true;
    }
    
    // If completed, it's the last status
    if (status === 'completed') {
      return true;
    }
    
    return false;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'N/A';
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
    if (!amount) return '0.00';
    return amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }

  cancelOrder(): void {
    // if (!this.orderDetails) return;

    // if (confirm('Are you sure you want to cancel this order?')) {
    //   this.orderService.cancelOrder(this.orderDetails.orderId).subscribe(
    //     (response: CommonResponse) => {
    //       if (response.status === 'SUCCESS') {
    //         this.toastService.successMessage('Order canceled successfully');
    //         this.loadOrderDetails(); // Reload to show updated status
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

  goBack(): void {
    this.location.back();
  }
}