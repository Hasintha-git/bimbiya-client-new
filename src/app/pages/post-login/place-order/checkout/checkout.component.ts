import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { Cart } from 'src/app/models/cart';
import { CartDetails } from 'src/app/models/cart-details';
import { Order } from 'src/app/models/order';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartDetails = new CartDetails();
  public cardList: Cart;
  public cartDataList: CartDetails[];
  public statusList: SimpleBase[];
  public timeSlot: SimpleBase[];
  hours: number[] = [];
  minutes: number[] = [];
  ampm: string[] = ['AM', 'PM'];
  minSelectableHour: number;
  selectedHour: number;
  selectedMinute: number;
  selectedAmPm: string;
  defaultDelivery = 4;
  selectedTime: string;
  isCartAvailable: boolean = false;
  orderReq = new Order();
  activeUser: string;

  constructor(private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private addToCartService: AddToCartService,
    private placeOrderService: OrderService,
    private toastService: ToastServiceService,
    private storageService: StorageService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activeUser = this.storageService.getUser();
    this.prepareReferenceData();
    this.cartDataGet();
    this.populateHours();
    this.populateMinutes();
    this.setDefaultTime();
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  prepareReferenceData(): void {
    this.placeOrderService.getSearchData(true)
      .subscribe((response: any) => {
        this.statusList = response.statusList;
        this.timeSlot = response.timeSlot;
        console.log(this.timeSlot)
      },
        error => {
          this.toastService.errorMessage(error.error['message']);
        }
      );
  }

  cartDataGet() {
    this.cartDetails.userName = this.activeUser;
    this.spinner.show();
    this.cartDetails.checkout = true;
    this.addToCartService.checkoutCartList(this.cartDetails).subscribe(
      (response: CommonResponse) => {
        if (response && response.data && response.data.cartList) {
          this.cardList = response.data;
          console.log(this.cardList.cartList[0]);
          this.cartDataList = this.cardList.cartList;
          console.log(this.cartDataList);


          // for (let index = 0; index < response.data.cartList.length; index++) {
          //   this.cardList.cartList.push(response.data.cartList[index]);
          // }
          // this.isCartAvailable = this.cardList && this.cardList.cartList && this.cardList.cartList.length > 0;
          this.cdRef.detectChanges();
        } else {
          this.isCartAvailable = false;
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }


  placeOrder() {
    this.spinner.show();
    this.orderReq.userId = this.cardList.userId;
    this.orderReq.product = this.cardList.cartList
    this.orderReq.total = this.cardList.total
    this.orderReq.deliveryPrice = this.cardList.deliveryPrice
    this.orderReq.scheduledTime = this.selectedTime;
    this.orderReq.activeUser = this.activeUser;
    this.placeOrderService.placeOrder(this.orderReq).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  }

  cartRemove(cart: any) {
    this.spinner.show();
    this.addToCartService.removeToCart(cart.cartId).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.cartDataGet();
        this.cardList.subTotal = this.cardList.subTotal - cart.price;
        this.cardList.total = this.cardList.subTotal + this.cardList.deliveryPrice;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
        this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  }

  populateHours(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const minSelectableHour = currentHour + this.defaultDelivery > 12 ? currentHour + this.defaultDelivery - 12 : currentHour + this.defaultDelivery;
    this.minSelectableHour = minSelectableHour;

    for (let i = minSelectableHour; i <= 12; i++) {
      this.hours.push(i);
    }
  }
  populateMinutes(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Calculate the minimum selectable minute
    let minSelectableMinute = currentMinute;

    // If the current hour is within 4 hours from now, disable minutes before the current minute
    if (currentHour + 4 >= 24) {
      minSelectableMinute = 0; // Start from 0 if it's past midnight
    } else {
      minSelectableMinute = (minSelectableMinute + 4 * 60) % 60; // Add 4 hours and ensure it's within 0-59 range
    }

    // Populate the minutes array starting from the minimum selectable minute
    for (let i = minSelectableMinute; i < 60; i++) {
      this.minutes.push(i);
    }
  }
  setDefaultTime(): void {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Calculate the delivery time based on the current time
    let deliveryTime = currentHour + this.defaultDelivery;
    let currentAmPm: string;

    // Adjust delivery time if it exceeds 12 hours
    if (deliveryTime >= 12) {
      deliveryTime -= 12;
      currentAmPm = 'PM';
    } else {
      currentAmPm = 'AM';
    }

    // Set the selected hour, minute, and AM/PM
    this.selectedHour = deliveryTime;
    this.selectedMinute = currentMinute;
    this.selectedAmPm = currentAmPm;

    // Construct the selected time string
    this.selectedTime = `${this.selectedHour}:${this.selectedMinute.toString().padStart(2, '0')} ${this.selectedAmPm}`;
  }

  onChangeHour(hour: number): void {
    this.selectedHour = hour;
    this.updateSelectedTime();
  }

  onChangeMinute(minute: number): void {
    this.selectedMinute = minute;
    this.updateSelectedTime();
  }

  onChangeAmPm(ampm: string): void {
    this.selectedAmPm = ampm;
    this.updateSelectedTime();
  }

  updateSelectedTime(): void {
    // Update the selected time string
    this.selectedTime = `${this.selectedHour}:${this.selectedMinute.toString().padStart(2, '0')} ${this.selectedAmPm}`;
  }

  // Define a method to handle null or undefined values
  sanitizeValue(value: any, defaultValue: any = ''): any {
    return value !== null && value !== undefined ? value : defaultValue;
  }


  home() {
    this.router.navigate(['/post-login/home']);
  }
  onDestroy() {
    this.spinner.hide();
  }
}
