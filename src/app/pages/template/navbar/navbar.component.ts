import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { CartDetails } from 'src/app/models/cart-details';
import { ForgetPasswordComponent } from 'src/app/pages/pre-login/authentication/forget-password/forget-password.component';
import { UserProfileComponent } from 'src/app/pages/pre-login/user-profile/user-profile.component';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';

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
  activeUser: string;
  itemsList: any[] = [];
  isUserLogged:boolean=false;

  constructor(private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private addToCartService: AddToCartService,
    private toastService: ToastServiceService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.activeUser = this.storageService.getUser();
    if(this.activeUser != null) {
      this.isUserLogged = true;
      this.cartDataGet();
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const cart = document.getElementById('cartBtn');
    if (cart && cart.contains(event.target as Node)) {
      return;
    } else {
      this.isCart = false;
    }

    const profile = document.getElementById('profileBtn');
    if (profile && profile.contains(event.target as Node)) {
      return;
    } else {
      this.isProfile = false;
    }

    const mobile = document.getElementById('mobileMenu');
    if (mobile && mobile.contains(event.target as Node)) {
      return;
    } else {
      this.isMobileMenuOpen = false;
    }
  }

  cartDataGet() {
    this.activeUser = this.storageService.getUser();
    this.cartDetails.userName = this.activeUser;
    
    this.cartDetails.checkout = false;
    this.addToCartService.findCartList(this.cartDetails).subscribe(
      (response: CommonResponse) => {
        this.cartDetailsList = response.records;
        
      },
      error => {
        
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
    this.cartDataGet();
  }

  cartRemove(id: any) {
    
    this.addToCartService.removeToCart(id).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.cartDataGet();
        
      },
      error => {
        
        this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  }

  logoutUser() {
    this.router.navigate(['/login']);
  }

  home() {
    this.router.navigate(['/post-login/home']);
  }

  accountCreate() {
    this.router.navigate(['/auth/signup']);
  }

  logout() {
    this.storageService.clear();
    this.isUserLogged = false;
    this.home();
  }
  foods() {
    this.router.navigate(['/post-login/product']);
  }
  checkout() {
    this.router.navigate(['/post-login/place-order']);
  }
}
