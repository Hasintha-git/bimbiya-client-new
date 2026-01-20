import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CartDetails } from 'src/app/models/cart-details';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('trendingTitle') trendingTitle!: ElementRef;
  
  cartDetails = new CartDetails();
  isTitleVisible = false; // Controls the CSS class
  private observer: IntersectionObserver | undefined;

  constructor(private addToCartService: AddToCartService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initObserver();
  }

  initObserver() {
    const options = {
      root: null, // use the viewport
      threshold: 0.1 // trigger when 10% of the element is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isTitleVisible = true;
          // Once it's visible, we can stop observing
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    if (this.trendingTitle) {
      this.observer.observe(this.trendingTitle.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

}
