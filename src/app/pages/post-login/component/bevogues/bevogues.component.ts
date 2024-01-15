import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-bevogues',
  templateUrl: './bevogues.component.html',
  styleUrls: ['./bevogues.component.scss']
})
export class BevoguesComponent implements OnInit ,AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  @ViewChild('scrollViewport') scrollViewport!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor() { }

  
  ngAfterViewInit(): void {
    setTimeout(() => {
      const swiper = new Swiper('.swiper-container-2', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        pagination: {
          el: '.swiper-pagination-2',
          clickable: true,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next-2',
          prevEl: '.swiper-button-prev-2',
        },  
        breakpoints: {
          1100: {
            slidesPerView:5,
            spaceBetween: 10, // Adjust as needed
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

      document.querySelectorAll('.swiper-button-next-2').forEach(button => {
        button.addEventListener('click', () => swiper.slideNext());
      });

      document.querySelectorAll('.swiper-button-prev-2').forEach(button => {
        button.addEventListener('click', () => swiper.slidePrev());
      });

      // Hide the last slide
      const swiperWrapper = this.swiperContainer.nativeElement.querySelector('.swiper-wrapper');
      const swiperSlides = swiperWrapper.querySelectorAll('.swiper-slide-2');
      const lastSlide = swiperSlides[swiperSlides.length - 1];
      lastSlide.style.display = 'none';
    }, 0);

  }

  ngOnInit(): void {
  }

}
