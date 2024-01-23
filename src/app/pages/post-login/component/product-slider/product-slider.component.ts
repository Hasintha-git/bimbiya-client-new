import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product } from 'src/app/models/product';
import { DataTable } from 'src/app/pages/models/data-table';
import { CommonFunctionService } from 'src/app/services/common-functions/common-function.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss']
})
export class ProductSliderComponent implements OnInit ,AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('scrollViewport') scrollViewport!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

// Inside your component class
showText: boolean = false;

public foodData: Product[];

  ngAfterViewInit(): void {
    setTimeout(() => {
      const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },  
        breakpoints: {
          1100: {
            slidesPerView: 3,
            spaceBetween: 20, // Adjust as needed
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10, // Adjust as needed
          },
          100: {
            slidesPerView: 1,
            spaceBetween: 0, // Adjust as needed
          },
        },
      });

      document.querySelectorAll('.swiper-button-next').forEach(button => {
        button.addEventListener('click', () => swiper.slideNext());
      });

      document.querySelectorAll('.swiper-button-prev').forEach(button => {
        button.addEventListener('click', () => swiper.slidePrev());
      });

      // Hide the last slide
      const swiperWrapper = this.swiperContainer.nativeElement.querySelector('.swiper-wrapper');
      const swiperSlides = swiperWrapper.querySelectorAll('.swiper-slide');
      const lastSlide = swiperSlides[swiperSlides.length - 1];
      lastSlide.style.display = 'none';
    }, 0);
  }
  constructor(
    private productService: ProductService,
    public toast: ToastServiceService,
    private commonFunctionService: CommonFunctionService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.getList();
  }

  
  getList() {
    this.productService.getTrendingList()
      .subscribe((data: DataTable<Product>) => {
        console.log("data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",data)
        this.foodData = data.records;
        console.log("---->", this.foodData)
        this.spinner.hide();
      },
        error => {
          this.spinner.hide();
          this.toast.errorMessage(error.error['errorDescription']);
        }
      );
  }
}
