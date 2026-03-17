import { Component, OnInit, AfterViewInit, ViewChild, 
         ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('trendingTitle') trendingTitle!: ElementRef;

  isTitleVisible = false;
  private observer: IntersectionObserver | undefined;

  constructor(private spinner: NgxSpinnerService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Slight delay ensures element is fully rendered in DOM
    setTimeout(() => this.initObserver(), 100);
  }

  initObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isTitleVisible = true;
          this.cdr.detectChanges(); // ← force Angular to pick up the change
          this.observer?.unobserve(entry.target);
        }
      });
    }, { root: null, threshold: 0.1 });

    if (this.trendingTitle) {
      this.observer.observe(this.trendingTitle.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}