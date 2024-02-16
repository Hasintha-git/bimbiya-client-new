import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { CartDetails } from 'src/app/models/cart-details';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  cartDetails = new CartDetails();

  constructor(private addToCartService: AddToCartService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.cartDataGet();
  }

  cartDataGet() {
    this.cartDetails.userName="yyy";
    this.spinner.show();
      this.addToCartService.removeToCart(this.cartDetails).subscribe(
        (response: CommonResponse) => {
          this.cartDetails=response.data;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
  }

}
