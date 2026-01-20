import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { DataTable } from 'src/app/pages/models/data-table';
import { ProductService } from 'src/app/services/product/product.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
// ... other imports

// This is the correct, exported path for Swiper 9 bundle
// @ts-ignore
import Swiper from 'swiper/bundle';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss']
})
export class ProductSliderComponent implements OnInit {
  public foodData: Product[] = [];
  private mySwiper: any;

  constructor(
    private productService: ProductService,
    public toast: ToastServiceService
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.productService.getTrendingList().subscribe({
      next: (data: DataTable<Product>) => {
        this.foodData = data.records;
        // Small delay to let Angular render the DOM
        setTimeout(() => {
          this.initSwiper();
        }, 400);
      },
      error: (error) => {
        this.toast.errorMessage(error.error['errorDescription']);
      }
    });
  }

  initSwiper() {
  if (this.mySwiper) {
    this.mySwiper.destroy(true, true);
  }

  this.mySwiper = new Swiper('.trending-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: false, // Must be FALSE for reverse/forward logic to work
    speed: 1000, 
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
      stopOnLastSlide: false, // We will handle the reverse manually
    },
    breakpoints: {
      1100: { slidesPerView: 3 },
      768: { slidesPerView: 2 },
      100: { slidesPerView: 1 }
    }
  });

  // THE REVERSE LOGIC
  let direction = 'forward';

  this.mySwiper.on('reachEnd', () => {
    direction = 'backward';
    // Small delay before it starts going back
    setTimeout(() => {
      this.mySwiper.autoplay.stop();
      this.reverseMove();
    }, 1500);
  });

  this.mySwiper.on('reachBeginning', () => {
    direction = 'forward';
    // Start standard autoplay again
    this.mySwiper.autoplay.start();
  });
}
private isPaused = false;
private reverseInterval: any; // Store the interval here to clear it

stopAutoplay() {
  this.isPaused = true;
  if (this.mySwiper) {
    this.mySwiper.autoplay.stop();
  }
  // Immediately kill the backward movement loop
  if (this.reverseInterval) {
    clearInterval(this.reverseInterval);
  }
}

resumeAutoplay() {
  this.isPaused = false;
  
  // Decide whether to resume forward or backward
  if (this.mySwiper) {
    if (this.mySwiper.isEnd || this.mySwiper.activeIndex > 0 && !this.mySwiper.isBeginning) {
       // If we were in the middle of going back, restart reverse
       this.reverseMove();
    } else {
       this.mySwiper.autoplay.start();
    }
  }
}

private reverseMove() {
  // Clear any existing interval first to prevent "speeding up"
  if (this.reverseInterval) clearInterval(this.reverseInterval);

  this.reverseInterval = setInterval(() => {
    // If the user hovered, do nothing
    if (this.isPaused) return;

    if (this.mySwiper.isBeginning) {
      clearInterval(this.reverseInterval);
      if (!this.isPaused) this.mySwiper.autoplay.start();
      return;
    }
    
    this.mySwiper.slidePrev(1000);
  }, 2500);
}
}