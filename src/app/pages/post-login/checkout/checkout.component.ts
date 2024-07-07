import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
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
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Time } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartDetails = new CartDetails();
  userAdd: FormGroup;
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
  defaultDelivery = 5;
  selectedTime: string;
  selectedTimeDesc: string;
  isCartAvailable: boolean = false;
  orderReq = new Order();
  activeUser: string;
// Initialize an array to store time slots
 timeSlots = [];

  isDropdownOpen: boolean = false;
  timeSlotControl: FormControl = new FormControl();
  // minTime: Date;
  // maxTime: Date;

  // @Input()	
  // value: string

  // oktTheme = {
  //   container: {
  //     bodyBackgroundColor: "#424242",
  //     buttonColor: "#fff"
  //   },
  //   dial: {
  //     dialBackgroundColor: "#555"
  //   },
  //   clockFace: {
  //     clockFaceBackgroundColor: "#555",
  //     clockHandColor: "#01806b",
  //     clockFaceTimeInactiveColor: "#fff"
  //   }
  // };

  constructor(private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private addToCartService: AddToCartService,
    private placeOrderService: OrderService,
    private toastService: ToastServiceService,
    private storageService: StorageService,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
  ) { 
    // const currentTime = new Date();
    // this.minTime = currentTime;
    // const next5Hours = new Date(currentTime);
    // next5Hours.setHours(next5Hours.getHours() + 5);
    // this.maxTime = next5Hours;
    // this.value = currentTime.toISOString();

  }

  onTimeset(event:any) {
  }

  ngOnInit(): void {
    this.initialValidator();
    this.activeUser = this.storageService.getUser();
    this.prepareReferenceData();
    this.cartDataGet();
    // this.populateHours();
    // this.populateMinutes();
    // this.setDefaultTime();

  }

  initialValidator() {
    this.userAdd = this.formBuilder.group({
    
      email: this.formBuilder.control('', [
        Validators.required, Validators.email
      ]),
      address: this.formBuilder.control('', [Validators.required]),
      city: this.formBuilder.control('', [Validators.required])
     
    });

    this.userAdd.get('email').setValidators(Validators.email);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setDefaultTime4() {
    const currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();
    
    // Add 4 hours to the current hour
    currentHour = (currentHour + 5) % 24;
  
    // Round up the minutes to the nearest 30 minutes
    currentMinute = Math.ceil(currentMinute / 30) * 30;
    if (currentMinute === 60) {
      currentMinute = 0;
      currentHour = (currentHour + 1) % 24;
    }
  
    // Find the index of the corresponding time slot in the timeSlot array
    const nearestSlotIndex = this.timeSlot.findIndex(slot => {
      const slotHour = Number(slot.code.split(':')[0]);
      const slotMinute = Number(slot.code.split(':')[1]);
      return slotHour === currentHour && slotMinute === currentMinute;
    });
  
    // Set the selected time and description
    if (nearestSlotIndex !== -1) {
      this.selectedTime = this.timeSlot[nearestSlotIndex].code;
      this.selectedTimeDesc = this.timeSlot[nearestSlotIndex].description;
      this.timeSlotControl.setValue(this.timeSlot[nearestSlotIndex].code);
    } else {
      console.error('No matching time slot found for the current time + 5 hours');
    }
    this.slotListCreateForDisable();

  }

  slotListCreateForDisable() {
    const currentTime = new Date();
    let currentHour = currentTime.getHours();
    let currentMinute = currentTime.getMinutes();

    // Calculate the nearest 30-minute increment
    currentMinute = Math.ceil(currentMinute / 30) * 30;
    if (currentMinute === 60) {
        currentMinute = 0;
        currentHour++;
    }

    

    // Loop through the next 5 hours, adding 30-minute intervals
    for (let i = 0; i < 10; i++) { // Loop 10 times for the next 5 hours
        // Ensure hour wraps around after 24
        currentHour = currentHour % 24;

        // Format hour and minute as strings with leading zeros if necessary
        const formattedHour = String(currentHour).padStart(2, '0');
        const formattedMinute = String(currentMinute).padStart(2, '0');

        // Create slot code (e.g., "HH:MM")
        const slotCode = `${formattedHour}:${formattedMinute}`;

        // Push the slot code into the array
        this.timeSlots.push(slotCode);

        // Increment the time by 30 minutes
        currentMinute += 30;
        if (currentMinute >= 60) {
            currentMinute = 0;
            currentHour++;
        }
    }
  }
  slotDisable(slotCode: string): boolean {
    for (let index = 0; index < this.timeSlots.length; index++) {
      if (slotCode === this.timeSlots[index]) {
        return true;
      }
    }
    return false;
  }

  
  isTimeBeforeMin(): boolean {
    if (!this.selectedTimeDesc) {
      return false; // Allow selection if no time is selected yet
    }
  
    const selectedTime = new Date();
    const [hours, minutes] = this.selectedTimeDesc.split(':').map(Number);
    selectedTime.setHours(hours);
    selectedTime.setMinutes(minutes);
  
    // Compare with the minimum time (09:00)
    const minTime = new Date();
    minTime.setHours(9);
    minTime.setMinutes(0);
  
    return selectedTime < minTime;
  }
  

  selectTime(timeCode: any) {
    this.selectedTime = timeCode.code;
    this.selectedTimeDesc = timeCode.description;
    this.timeSlotControl.setValue(timeCode);
    this.toggleDropdown();
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  prepareReferenceData(): void {
    this.placeOrderService.getSearchData(true)
      .subscribe((response: any) => {
        this.statusList = response.statusList;
        this.timeSlot = response.timeSlot;
      },
        error => {
          this.toastService.errorMessage(error.error['message']);
        }
      );
  }

  cartDataGet() {
    this.cartDetails.userName = this.activeUser;
    
    this.cartDetails.checkout = true;
    this.addToCartService.checkoutCartList(this.cartDetails).subscribe(
      (response: CommonResponse) => {
        if (response && response.data && response.data.cartList) {
          this.cardList = response.data;
          this.orderReq.email = this.cardList.email;
          this.orderReq.address = this.cardList.address;
          this.orderReq.city = this.cardList.city;
          this.cartDataList = this.cardList.cartList;

          if(this.cardList.cartList.length == 0  && this.cardList?.cartList) {
            this.home();
            
          }
          this.setDefaultTime4();
        } else {
          this.isCartAvailable = false;
        }
        
      },
      error => {
        
      }
    );
  }


  placeOrder() {  
    if(this.userAdd.valid) {
      this.orderReq.userId = this.cardList.userId;
      this.orderReq.product = this.cardList.cartList
      this.orderReq.total = this.cardList.total
      this.orderReq.deliveryPrice = this.cardList.deliveryPrice
      this.orderReq.scheduledTime = this.selectedTime;
      this.orderReq.activeUser = this.activeUser;
      this.placeOrderService.placeOrder(this.orderReq).subscribe(
        (response: CommonResponse) => {
          this.toastService.successMessage("Order placed, we will contact soon");
          this.home();
        },
        error => {
          this.toastService.errorMessage(error.error['errorDescription']);
        }
      );
    }else {
      this.mandatoryValidation(this.userAdd)
    }
  }

  mandatoryValidation(formGroup: FormGroup) {
    for (const key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        const control: FormControl = <FormControl>formGroup.controls[key];
        if (Object.keys(control).includes('controls')) {
          const formGroupChild: FormGroup = <FormGroup>formGroup.controls[key];
          this.mandatoryValidation(formGroupChild);
        }
        control.markAsTouched();
      }
    }
  }

  updateUserAccount() {
  }
  cartRemove(cart: any) {
    
    this.addToCartService.removeToCart(cart.cartId).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.cartDataGet();
        this.cardList.subTotal = this.cardList.subTotal - cart.price;
        this.cardList.total = this.cardList.subTotal + this.cardList.deliveryPrice;
        
      },
      error => {
        
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
    if (currentHour + 5 >= 24) {
      minSelectableMinute = 0; // Start from 0 if it's past midnight
    } else {
      minSelectableMinute = (minSelectableMinute + 5 * 60) % 60; // Add 4 hours and ensure it's within 0-59 range
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
    this.router.navigate(['/delivery/home']);
  }
  onDestroy() {
    
  }

  get email() {
    return this.userAdd.get('email');
  }

  get address() {
    return this.userAdd.get('address');
  }

  get city() {
    return this.userAdd.get('city');
  }
}
