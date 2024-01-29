import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { CartDetails } from 'src/app/models/cart-details';
import { ForgetPasswordComponent } from 'src/app/pages/pre-login/authentication/forget-password/forget-password.component';
import { UserProfileComponent } from 'src/app/pages/pre-login/user-profile/user-profile.component';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isMobileMenuOpen = false;
  isProfile = false;
  isCart = false;
  buttonHover: boolean;
  
  cartDetails = new CartDetails();
  public cartDetailsList: CartDetails[];

  itemsList: any[] = [];

  constructor(private router: Router,
              public dialog: MatDialog,
              private spinner: NgxSpinnerService,
              private addToCartService: AddToCartService,
    ) { }


    
  ngOnInit(): void {
    this.cartDataGet();
  }

  cartDataGet() {
    this.cartDetails.userName="admin";
    this.spinner.show();
      this.addToCartService.findCartList(this.cartDetails).subscribe(
        (response: CommonResponse) => {
          console.log(response)
          this.cartDetailsList=response.records;
          console.log(this.cartDetailsList)
          console.log(this.itemsList)
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
  }
  
  profileMgt() {
    this.router.navigate(['/user-profile']);
  }

  forgetPassword() {
    this.isProfile = false;
    const dialogRef = this.dialog.open(ForgetPasswordComponent, { data: 12, width: '500px', height: '300px' });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileMenu() {
    this.isProfile = !this.isProfile;
    this.isCart = false;
  }

  toggleCartMenu() {
    this.isCart = !this.isCart;
    this.isProfile = false;
  }

  logoutUser() {
    this.router.navigate(['/login']);
  }

  home() {
    this.router.navigate(['/post-login/home']);
  }

  foods() {
    this.router.navigate(['/post-login/product']);
  }
}
