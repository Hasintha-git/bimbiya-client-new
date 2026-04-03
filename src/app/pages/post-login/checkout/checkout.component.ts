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
  cartId:        number;
  qty:           number;
  personCount:   number;
  perPersonPrice?: number;  // cached for price recalc when person count changes
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
  sub:      string;
  icon:     string;
  value:    string;
  disabled: boolean;
}

export interface QuickDay {
  date:       string;
  dow:        string;
  dd:         number;
  mon:        string;
  isToday:    boolean;
  isTomorrow: boolean;
}

@Component({
  selector:    'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls:   ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  // ── Stepper ───────────────────────────────────────
  currentStep = 0;       // 0 = Schedule, 1 = Details, 2 = Review
  step1Submitted = false;
  step2Submitted = false;

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

  focusAddress = false;
  focusCity    = false;
  focusMobile  = false;
  focusNote    = false;

  // ── Delivery schedule ─────────────────────────────
  selectedDay:  QuickDay | null = null;
  deliveryTime: string          = '';
  selectedSlot: string          = '';
  customTimeValue   = '';
  customTimeDisplay = '';

  schedulePreviewLabel = '';
  quickDays: QuickDay[] = [];
  customTimeMin = '';

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
  public  router:         Router,    
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

  // ── Stepper navigation ────────────────────────────
  goNext(): void {
    if (this.currentStep === 0) {
      this.step1Submitted = true;
      if (!this.isDeliveryValid()) {
        this.toast.errorMessage('Please select a date and time');
        return;
      }
    }
    if (this.currentStep === 1) {
      this.step2Submitted = true;
      if (!this.isDetailsValid()) {
        this.toast.errorMessage('Please fill in all required fields');
        return;
      }
    }
    this.currentStep++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.markForCheck();
  }

  goBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.cdr.markForCheck();
    }
  }

  goToStep(step: number): void {
    this.currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.markForCheck();
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
  this.selectedDay       = day;
  this.selectedSlot      = '';
  this.deliveryTime      = '';
  this.customTimeDisplay = '';
  this.refreshSlotDisabled(day.isToday);
  this.updateCustomTimeMin(day.isToday); // ← add this
  this.updateSchedulePreview();
  this.cdr.markForCheck();
}

private updateCustomTimeMin(isToday: boolean): void {
  if (!isToday) {
    this.customTimeMin = ''; // no restriction on future days
    return;
  }
  const now      = new Date();
  const minHour  = now.getHours() + (now.getMinutes() > 0 ? 1 : 0) + 5;
  const clamped  = Math.min(minHour, 23); // cap at 23:00
  this.customTimeMin = `${String(clamped).padStart(2, '0')}:00`;
}
  // ── Select time slot chip ─────────────────────────
  selectSlot(slot: TimeSlot): void {
    if (slot.disabled) return;
    this.selectedSlot      = slot.value;
    this.deliveryTime      = slot.value;
    this.customTimeDisplay = '';
    this.updateSchedulePreview();
    this.cdr.markForCheck();
  }

  // ── Custom time picker ────────────────────────────
openCustomPicker(): void {
  if (!this.selectedDay) {
    this.toast.errorMessage('Please select a delivery date first');
    return;
  }
  const input = document.querySelector('.co-custom-time-input') as any;
  input?.showPicker?.();
  input?.click();
}

onCustomTimeChange(event: any): void {
  const val = event.target.value;
  if (!val) return;

  // ── 5h prep time check ────────────────────────────
  if (this.selectedDay?.isToday) {
    const [h, m]      = val.split(':').map(Number);
    const now         = new Date();
    const selectedMin = h * 60 + m;
    const cutoffMin   = (now.getHours() + (now.getMinutes() > 0 ? 1 : 0) + 5) * 60;

    if (selectedMin < cutoffMin) {
      const cutoffHr    = Math.floor(cutoffMin / 60) % 24;
      const cutoffM     = cutoffMin % 60;
      const cutoffAmpm  = cutoffHr >= 12 ? 'pm' : 'am';
      const cutoffHr12  = cutoffHr % 12 || 12;
      const cutoffStr   = `${cutoffHr12}:${String(cutoffM).padStart(2,'0')} ${cutoffAmpm}`;
      this.toast.errorMessage(`Earliest available time today is ${cutoffStr} (5h prep time)`);
      // reset
      this.customTimeValue   = '';
      this.customTimeDisplay = '';
      if (this.selectedSlot === 'custom') {
        this.selectedSlot = '';
        this.deliveryTime = '';
        this.updateSchedulePreview();
      }
      this.cdr.markForCheck();
      return;
    }
  }
  // ─────────────────────────────────────────────────

  this.selectedSlot = 'custom';
  this.deliveryTime = val;
  const [h, m]           = val.split(':').map(Number);
  const ampm             = h >= 12 ? 'pm' : 'am';
  const hr12             = h % 12 || 12;
  this.customTimeDisplay = `${hr12}:${String(m).padStart(2,'0')} ${ampm}`;
  this.updateSchedulePreview();
  this.cdr.markForCheck();
}

  // ── Disable past slots when today selected ────────
  private refreshSlotDisabled(isToday: boolean): void {
    const now       = new Date();
    const nowHour   = now.getHours() + (now.getMinutes() > 0 ? 1 : 0); // round up
    const cutoff    = nowHour + 5; // need at least 5h prep time

    this.timeSlots = this.timeSlots.map(s => ({
      ...s,
      // disable if today AND slot start hour is within 5h from now
      disabled: isToday && parseInt(s.value) < cutoff,
    }));
  }

  // ── Build preview label ───────────────────────────
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

        if (data.userId)   this.userId         = data.userId;
        if (data.fullName) this.userFullName    = data.fullName;
        if (data.mobile)   this.userMobile      = data.mobile;
        if (data.address)  this.deliveryAddress = data.address;
        if (data.city)     this.deliveryCity    = data.city;

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

  // ── Person count controls (mirrors product card logic) ────────
  incrementPersonCount(item: CartItem): void {
    const isBev = item.product.productCategory === 'BEVERAGES';
    const step  = isBev ? 1 : 2;
    const max   = isBev ? 30 : 50;
    if (!item.perPersonPrice) {
      item.perPersonPrice = item.product.price / item.personCount;
    }
    if (item.personCount < max) {
      item.personCount   += step;
      item.product.price  = item.perPersonPrice * item.personCount;
      this.recalcTotal();
      this.cdr.markForCheck();
    }
  }

  decrementPersonCount(item: CartItem): void {
    const isBev = item.product.productCategory === 'BEVERAGES';
    const step  = isBev ? 1 : 2;
    const min   = isBev ? 1 : 4;
    if (!item.perPersonPrice) {
      item.perPersonPrice = item.product.price / item.personCount;
    }
    if (item.personCount > min) {
      item.personCount   -= step;
      item.product.price  = item.perPersonPrice * item.personCount;
      this.recalcTotal();
      this.cdr.markForCheck();
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
    if (this.cartItems.length === 0) {
      this.toast.errorMessage('Your cart is empty');
      return;
    }

    const scheduledTime  = this.buildScheduledTime();
    const orderPayload   = {
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