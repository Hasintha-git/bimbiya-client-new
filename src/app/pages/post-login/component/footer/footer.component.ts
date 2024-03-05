import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  privacyPolicy() {
    this.router.navigate(['/delivery/privacy-policy']);
  }
  returnPolicy() {
    this.router.navigate(['/delivery/return-policy']);
  }
  termAndCondition() {
    this.router.navigate(['/delivery/term-and-condition']);
  }
  faq() {
    this.router.navigate(['/delivery/faq']);
  }
  contactUs() {
    this.router.navigate(['/delivery/contact-us']);
  }
}
