import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { initFlowbite } from 'flowbite';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit  {
  headlineVisible: boolean = true; 
 
  constructor(private router: Router) {}

  ngOnInit() {
    initFlowbite();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page
        window.scrollTo(0, 0);
      }
    });
  }

    @HostListener('window:scroll', [])
  onWindowScroll() {
    // hide headline if scrollTop > 0
    this.headlineVisible = window.pageYOffset === 0;
  }
  
}
