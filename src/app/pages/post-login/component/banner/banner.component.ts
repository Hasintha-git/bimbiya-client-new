import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import Swiper from 'swiper';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, AfterViewInit  {
  title = 'bimbiya-client';

  ngAfterViewInit(): void {
    setTimeout(() => {
      const swiper = new Swiper('.swiper-container-1', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next-1',
          prevEl: '.swiper-button-prev-1',
        },
        zoom: true,
      });

      document.querySelectorAll('.swiper-button-next-1').forEach(button => {
        button.addEventListener('click', () => swiper.slideNext());
      });

      document.querySelectorAll('.swiper-button-prev-1').forEach(button => {
        button.addEventListener('click', () => swiper.slidePrev());
      });

    }, 0);
  }

  constructor(private router: Router,
    private storage: StorageService) { }

ngOnInit(): void {
}

productSection(type: any) {
this.storage.setCategory(type);
this.router.navigate(['/delivery/product']);
}

}
