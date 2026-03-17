import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Product } from 'src/app/models/product';
import { DataTable } from 'src/app/pages/models/data-table';
import { ProductService } from 'src/app/services/product/product.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
// @ts-ignore
import Swiper from 'swiper/bundle';

@Component({
  selector:    'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls:   ['./product-slider.component.scss']
})
export class ProductSliderComponent implements OnInit, OnDestroy {

  public foodData: Product[] = [];

  private mySwiper:        any;
  private reverseInterval: any;
  private initTimer:        any;
  private isPaused        = false;
  private direction: 'forward' | 'backward' = 'forward';

  constructor(
    private productService: ProductService,
    private cdr:            ChangeDetectorRef,
    public  toast:          ToastServiceService,
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  ngOnDestroy(): void {
    this.destroySwiper();
    clearTimeout(this.initTimer);
    clearInterval(this.reverseInterval);
  }

  // ── Data ─────────────────────────────────────────────────────
  getList(): void {
    this.productService.getTrendingList().subscribe({
      next: (data: DataTable<Product>) => {
        this.foodData = [...(data.records ?? [])];

        // Let cdr flush the *ngFor, THEN init swiper
        this.cdr.detectChanges();

        clearTimeout(this.initTimer);
        this.initTimer = setTimeout(() => this.initSwiper(), 300);
      },
      error: (err) => {
        this.toast.errorMessage(err.error?.errorDescription ?? 'Failed to load products');
      }
    });
  }

  // ── Swiper init ───────────────────────────────────────────────
  private initSwiper(): void {
    this.destroySwiper();

    this.direction = 'forward';

    this.mySwiper = new Swiper('.trending-swiper', {
      slidesPerView:    1,
      spaceBetween:     20,
      loop:             false,
      speed:            800,
      observer:         true,   // ← watches DOM changes
      observeParents:   true,   // ← also watches parent changes
      autoplay: {
        delay:                  2000,
        disableOnInteraction:   false,
        stopOnLastSlide:        false,
      },
      breakpoints: {
        1100: { slidesPerView: 3, spaceBetween: 24 },
        768:  { slidesPerView: 2, spaceBetween: 20 },
        0:    { slidesPerView: 1, spaceBetween: 14 },
      },
    });

    // ── Forward → reach end → go backward
    this.mySwiper.on('reachEnd', () => {
      if (this.direction === 'backward') return; // already reversing
      this.direction = 'backward';
      this.mySwiper.autoplay.stop();
      setTimeout(() => {
        if (!this.isPaused) this.startReverse();
      }, 1800);
    });

    // ── Backward → reach start → go forward
    this.mySwiper.on('reachBeginning', () => {
      if (this.direction === 'forward') return;
      this.direction = 'forward';
      clearInterval(this.reverseInterval);
      setTimeout(() => {
        if (!this.isPaused) this.mySwiper?.autoplay.start();
      }, 1800);
    });
  }

  // ── Hover controls ────────────────────────────────────────────
  stopAutoplay(): void {
    this.isPaused = true;
    this.mySwiper?.autoplay.stop();
    clearInterval(this.reverseInterval);
  }

  resumeAutoplay(): void {
    this.isPaused = false;
    if (!this.mySwiper) return;

    if (this.direction === 'backward' && !this.mySwiper.isBeginning) {
      this.startReverse();
    } else if (!this.mySwiper.isEnd) {
      this.mySwiper.autoplay.start();
    }
  }

  // ── Reverse slide loop ────────────────────────────────────────
  private startReverse(): void {
    clearInterval(this.reverseInterval);
    this.reverseInterval = setInterval(() => {
      if (this.isPaused || !this.mySwiper) return;

      if (this.mySwiper.isBeginning) {
        clearInterval(this.reverseInterval);
        this.direction = 'forward';
        setTimeout(() => {
          if (!this.isPaused) this.mySwiper?.autoplay.start();
        }, 1800);
        return;
      }

      this.mySwiper.slidePrev(800);
    }, 2500);
  }

  // ── Cleanup ───────────────────────────────────────────────────
  private destroySwiper(): void {
    clearInterval(this.reverseInterval);
    if (this.mySwiper) {
      this.mySwiper.destroy(true, true);
      this.mySwiper = null;
    }
  }

  trackByProduct(_: number, item: Product): any {
  return item?.packageId ?? _;
}
}