import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

  // @ts-ignore
import Swiper from 'swiper/bundle';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit, AfterViewInit {
  private infoSwiper: any;


// Inside your Component class:
ngAfterViewInit(): void {
  // Use a slightly longer timeout to ensure the mobile view is fully rendered
  setTimeout(() => {
    this.initInfoSlider();
  }, 800); 
}

private initInfoSlider() {
  new Swiper('.info-swiper-container', {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    speed: 800, 
    // Force Autoplay to start
    autoplay: {
      delay: 2000, 
      disableOnInteraction: false,
    },
    // This is the secret fix for Angular
    observer: true,
    observeParents: true,
    
    breakpoints: {
      // Screen >= 768px (Desktop)
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
        autoplay: false, // Turn off auto-slide for Desktop
        loop: false,
        allowTouchMove: false // Lock it so it doesn't move on desktop
      }
    }
  });
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
