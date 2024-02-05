import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { Cart } from 'src/app/models/cart';
import { CartDetails } from 'src/app/models/cart-details';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartDetails = new CartDetails();
  public cartDetailsList: Cart;


  constructor(private router: Router,
              public dialog: MatDialog,
              private spinner: NgxSpinnerService,
              private addToCartService: AddToCartService,
              private toastService: ToastServiceService,
    ) { }

  ngOnInit(): void {
    this.cartDataGet();
  }

  cartDataGet() {
    this.cartDetails.userName="admin";
    this.spinner.show();
    this.cartDetails.checkout = true;
      this.addToCartService.checkoutCartList(this.cartDetails).subscribe(
        (response: CommonResponse) => {
          console.log(response)
          this.cartDetailsList=response.data;
          console.log(this.cartDetailsList)
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
  }
  
  cartRemove(id:any) {
    this.spinner.show();
      this.addToCartService.removeToCart(id).subscribe(
        (response: CommonResponse) => {
          console.log(response.responseDescription);
          this.toastService.successMessage(response.responseDescription);
          this.cartDataGet();
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
          this.toastService.errorMessage(error.error['errorDescription']);
        }
      );
  }
}
