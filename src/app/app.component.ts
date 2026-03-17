import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  headlineVisible = true;
  private lastScrollY = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    initFlowbite();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

@HostListener('window:scroll', [])
onWindowScroll() {
  // 10px threshold prevents flicker at exact 0
  this.headlineVisible = window.scrollY < 10;
}
}