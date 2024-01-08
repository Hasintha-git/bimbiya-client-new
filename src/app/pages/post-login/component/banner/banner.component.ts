import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, AfterViewInit  {
  title = 'bimbiya-client';
  @ViewChild('swiper', { static: false }) swiper: ElementRef;

  ngAfterViewInit(): void {
    const swiper = new Swiper(this.swiper.nativeElement, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 3000, // Adjust slide duration as needed (in milliseconds)
        disableOnInteraction: false, // Allow manual interaction to keep autoplay
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
      },
    });
    swiper.autoplay.start();
  }
  ngOnInit() {

  }

}
