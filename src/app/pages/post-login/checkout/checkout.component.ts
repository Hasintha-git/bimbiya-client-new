import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { IngredientsDialogComponent } from '../component/product/ingredients-dialog/ingredients-dialog.component';

export interface CartItem {
  cartId:      number;
  qty:         number;
  personCount: number;
  product: {
    packageId:          number;
    mealName:           string;
    price:              number;
    img:                string;
    productCategory:    string;
    ingredients:        any[];
    portionDescription: string;
  };
}

export interface TimeSlot {
  label:    string;
  sub:      string;      // e.g. "8 – 11 am"
  icon:     string;      // emoji
  value:    string;      // HH:mm
  disabled: boolean;
}

export interface QuickDay {
  date:       string;   // yyyy-MM-dd
  dow:        string;   // Mon, Tue…
  dd:         number;
  mon:        string;   // Jan, Feb…
  isToday:    boolean;
  isTomorrow: boolean;
}

@Component({
  selector:    'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls:   ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  // ── Cart ──────────────────────────────────────────
  cartItems:  CartItem[] = [];
  activeUser: string     = '';
  userId:     number     = 0;

  // ── Pricing ───────────────────────────────────────
  subTotal:      number = 0;
  deliveryPrice: number = 0;
  orderTotal:    number = 0;

  // ── Delivery details ──────────────────────────────
  userFullName:    string = '';
  userMobile:      string = '';
  deliveryAddress: string = '';
  deliveryCity:    string = '';
  specialNote:     string = '';
customTimeValue   = '';
customTimeDisplay = '';


  focusAddress     = false;
  focusCity        = false;
  focusMobile      = false;
  focusNote        = false;
  detailsSubmitted = false;

  // ── Delivery schedule ─────────────────────────────
  selectedDay:  QuickDay | null = null;
  deliveryTime: string          = '';   // HH:mm
  selectedSlot: string          = '';   // active chip value
  deliverySubmitted = false;

  schedulePreviewLabel = '';
  quickDays: QuickDay[] = [];

  timeSlots: TimeSlot[] = [
    { label: 'Morning', sub: '8 – 11 am',  icon: '☀️',  value: '08:00', disabled: false },
    { label: 'Noon',    sub: '11am – 2pm', icon: '🌤️', value: '11:00', disabled: false },
    { label: 'Evening', sub: '4 – 7 pm',   icon: '🌇',  value: '16:00', disabled: false },
    { label: 'Night',   sub: '7 – 9 pm',   icon: '🌙',  value: '19:00', disabled: false },
  ];

  private readonly MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                              'Jul','Aug','Sep','Oct','Nov','Dec'];
  private readonly DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  constructor(
    private cartService:    AddToCartService,
    private orderService:   OrderService,
    private storageService: StorageService,
    private spinner:        NgxSpinnerService,
    private toast:          ToastServiceService,
    private router:         Router,
    private dialog:         MatDialog,
    private cdr:            ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.activeUser   = this.storageService.getUser()     || '';
    this.userFullName = this.storageService.getFullName() || '';
    this.userMobile   = this.activeUser;
    this.buildQuickDays();
    this.loadCart();
  }

  // ── Build 14-day strip ────────────────────────────
  buildQuickDays(): void {
    const now = new Date();
    this.quickDays = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      return {
        date:       d.toISOString().split('T')[0],
        dow:        this.DAYS[d.getDay()],
        dd:         d.getDate(),
        mon:        this.MONTHS[d.getMonth()],
        isToday:    i === 0,
        isTomorrow: i === 1,
      };
    });
  }

  // ── Select day chip ───────────────────────────────
  selectDay(day: QuickDay): void {
    this.selectedDay  = day;
    this.selectedSlot = '';
    this.deliveryTime = '';
    this.refreshSlotDisabled(day.isToday);
    this.updateSchedulePreview();
  }

  // ── Select time slot chip ─────────────────────────
  selectSlot(slot: TimeSlot): void {
    if (slot.disabled) return;
    this.selectedSlot = slot.value;
    this.deliveryTime = slot.value;
  this.customTimeDisplay = '';  
    this.updateSchedulePreview();
  }

openCustomPicker(): void {
  const input = document.querySelector('.co-custom-time-input') as any;
  input?.showPicker?.();
  input?.click();
}


onCustomTimeChange(event: any): void {
  const val = event.target.value;
  if (!val) return;
  this.selectedSlot = 'custom';
  this.deliveryTime = val;

  // format display: "14:30" → "2:30 pm"
  const [h, m]          = val.split(':');
  const hr              = parseInt(h);
  const ampm            = hr >= 12 ? 'pm' : 'am';
  const hr12            = hr % 12 || 12;
  this.customTimeDisplay = `${hr12}:${m} ${ampm}`;

  this.updateSchedulePreview();
}

  // ── Disable past slots when Today is selected ─────
  private refreshSlotDisabled(isToday: boolean): void {
    const now = new Date();
    this.timeSlots = this.timeSlots.map(s => ({
      ...s,
      disabled: isToday && parseInt(s.value) <= now.getHours(),
    }));
  }

private updateSchedulePreview(): void {
  if (!this.selectedDay || !this.deliveryTime) {
    this.schedulePreviewLabel = ''; return;
  }
  let timeLabel: string;
  if (this.selectedSlot === 'custom') {
    timeLabel = `Custom · ${this.customTimeDisplay}`;
  } else {
    const slot = this.timeSlots.find(s => s.value === this.selectedSlot);
    timeLabel  = slot ? `${slot.label} · ${slot.sub}` : this.deliveryTime;
  }
  const dateLabel = this.selectedDay.isToday
    ? 'Today'
    : this.selectedDay.isTomorrow
    ? 'Tomorrow'
    : `${this.selectedDay.dd} ${this.selectedDay.mon}`;
  this.schedulePreviewLabel = `${dateLabel} · ${timeLabel}`;
}

  // ── Validation ────────────────────────────────────
  isDeliveryValid(): boolean {
    return !!this.selectedDay && !!this.deliveryTime;
  }

  isDetailsValid(): boolean {
    return (
      !!this.userMobile.trim()      &&
      !!this.deliveryAddress.trim() &&
      !!this.deliveryCity.trim()
    );
  }

  // ── Build scheduledTime → "HH:mm:ss" ─────────────
  private buildScheduledTime(): string {
    const t = this.deliveryTime;
    return t.length === 5 ? `${t}:00` : t;
  }

  // ── Load cart ─────────────────────────────────────
  loadCart(): void {
    if (!this.activeUser) {
      this.router.navigate(['/auth/signin']);
      return;
    }

    this.spinner.show();
    this.cartService.checkoutCartList({
      isPriceChange: false,
      userName:      this.activeUser,
      checkout:      true,
    }).subscribe(
      (response: any) => {
        this.spinner.hide();
        const data = response?.data;
        if (!data) { this.toast.errorMessage('No cart data found'); return; }

        this.cartItems = (data.cartList ?? []).map((c: any) => ({
          cartId:      c.cartId,
          qty:         c.qty         ?? 1,
          personCount: c.personCount ?? 4,
          product: {
            packageId:          c.packageId,
            mealName:           c.mealName,
            price:              c.price,
            img:                c.image,
            productCategory:    c.productCategory ?? 'BITE',
            ingredients:        (c.ingredients ?? []).map((ing: any) =>
              typeof ing === 'string' ? { name: ing } : ing
            ),
            portionDescription: c.portionDescription ?? '',
          }
        }));

        this.subTotal      = data.subTotal      ?? 0;
        this.deliveryPrice = data.deliveryPrice ?? 0;
        this.orderTotal    = data.total         ?? 0;

        if (data.userId)   this.userId          = data.userId;
        if (data.fullName) this.userFullName     = data.fullName;
        if (data.mobile)   this.userMobile       = data.mobile;
        if (data.address)  this.deliveryAddress  = data.address;
        if (data.city)     this.deliveryCity     = data.city;

        this.cdr.markForCheck();
      },
      error => {
        this.spinner.hide();
        this.toast.errorMessage(error.error?.errorDescription || 'Failed to load cart');
      }
    );
  }

  // ── Qty controls ──────────────────────────────────
  incrementQty(item: CartItem): void {
    item.qty++;
    this.recalcTotal();
    this.cdr.markForCheck();
  }

  decrementQty(item: CartItem): void {
    if (item.qty > 1) {
      item.qty--;
      this.recalcTotal();
      this.cdr.markForCheck();
    } else {
      this.removeItem(item);
    }
  }

  recalcTotal(): void {
    this.subTotal   = this.cartItems.reduce((s, i) => s + (i.product.price * i.qty), 0);
    this.orderTotal = this.subTotal + this.deliveryPrice;
  }

  removeItem(item: CartItem): void {
    this.cartService.removeToCart(item.cartId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(c => c.cartId !== item.cartId);
        this.recalcTotal();
        this.cdr.markForCheck();
        this.toast.successMessage('Item removed');
      },
      error: err => this.toast.errorMessage(err.error?.errorDescription || 'Remove failed')
    });
  }

  getTotal(): number { return this.orderTotal; }

  // ── Ingredients dialog ────────────────────────────
  openProductDialog(item: CartItem): void {
    this.dialog.open(IngredientsDialogComponent, {
      data:          { product: item.product },
      panelClass:    'ingredients-dialog-panel',
      backdropClass: 'ingredients-backdrop',
      maxWidth:      '95vw',
      width:         '420px',
      autoFocus:     false,
    });
  }

  // ── Place order ───────────────────────────────────
  placeOrder(): void {
    this.deliverySubmitted = true;
    this.detailsSubmitted  = true;

    if (!this.isDeliveryValid()) {
      document.querySelector('.co-delivery-card')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (!this.isDetailsValid()) {
      document.querySelector('.co-details-card')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (this.cartItems.length === 0) {
      this.toast.errorMessage('Your cart is empty');
      return;
    }

    const scheduledTime = this.buildScheduledTime();

    const orderPayload = {
      userId:        this.userId,
      activeUser:    this.activeUser,
      orderDate:     `${this.selectedDay!.date} ${scheduledTime}`,
      scheduledTime: scheduledTime,
      total:         this.orderTotal,
      deliveryPrice: this.deliveryPrice,
      address:       this.deliveryAddress,
      city:          this.deliveryCity,
      mobile:        this.userMobile,
      product:       this.cartItems.map(i => ({
        packageId:   i.product.packageId,
        qty:         i.qty,
        personCount: i.personCount,
        price:       i.product.price,
        cartId:      i.cartId,
      })),
    };

    this.spinner.show();
    this.orderService.placeOrder(orderPayload).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.toast.successMessage(response?.responseDescription || 'Order placed successfully!');
        this.router.navigate(['/delivery/home']);
      },
      error => {
        this.spinner.hide();
        this.toast.errorMessage(error.error?.errorDescription || 'Failed to place order');
      }
    );
  }

  // ── Utils ─────────────────────────────────────────
  trackById(_: number, item: CartItem): number { return item.cartId; }

  onImgError(event: any): void {
    event.target.src = 'assets/images/placeholder-food.png';
  }
}