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
    this.router.navigate(['/post-login/privacy-policy']);
  }
  returnPolicy() {
    this.router.navigate(['/post-login/return-policy']);
  }
  termAndCondition() {
    this.router.navigate(['/post-login/term-and-condition']);
  }
  faq() {
    this.router.navigate(['/post-login/faq']);
  }
  contactUs() {
    this.router.navigate(['/post-login/contact-us']);
  }
}
