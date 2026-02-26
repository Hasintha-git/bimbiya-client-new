import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { CartDetails } from 'src/app/models/cart-details';
import { ForgetPasswordComponent } from 'src/app/pages/pre-login/authentication/forget-password/forget-password.component';
import { UserProfileComponent } from 'src/app/pages/pre-login/user-profile/user-profile.component';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isMobileMenuOpen = false;
  isProfileSidebarOpen = false;  // Changed from isProfile to isProfileSidebarOpen
  isCart = false;
  buttonHover: boolean;

  cartDetails = new CartDetails();
  public cartDetailsList: CartDetails[];
  activeUser: string;
  itemsList: any[] = [];
  isUserLogged: boolean = false;
  activeFullName: string;
  cartCount: number = 0;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private addToCartService: AddToCartService,
    private toastService: ToastServiceService,
    private storageService: StorageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$().subscribe(isLogged => {
      this.isUserLogged = isLogged;

      if (isLogged) {
        this.activeUser = this.storageService.getUser();
        this.activeFullName = this.storageService.getFullName();
        this.cartDataGet();
      } else {
        this.cartCount = 0;
      }
    });

    this.addToCartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

        const state = history.state;
    if (state?.openSidebar) {
      setTimeout(() => {
        this.isProfileSidebarOpen = true;
      }, 100); // Small delay to ensure DOM is ready
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
    }
    // Note: Don't close sidebar on outside click - let overlay handle it

    const mobile = document.getElementById('mobileMenu');
    if (mobile && mobile.contains(event.target as Node)) {
      return;
    } else {
      this.isMobileMenuOpen = false;
    }
  }

  cartDataGet() {
    this.activeUser = this.storageService.getUser();
    if (this.activeUser) {
      this.cartDetails.userName = this.activeUser;
      this.cartDetails.checkout = false;
      
      this.addToCartService.findCartList(this.cartDetails).subscribe(
        (response: CommonResponse) => {
          this.cartDetailsList = response.records;
          this.cartCount = this.cartDetailsList.length;
          this.addToCartService.setCartCount(this.cartCount);
        },
        error => {
          // Handle error
        }
      );
    } else {
      this.logoutUser();
    }
  }

  profileMgt() {
    this.router.navigate(['/user-profile']);
  }

  forgetPassword() {
    this.isProfileSidebarOpen = false;
    const dialogRef = this.dialog.open(ForgetPasswordComponent, { 
      data: 12, 
      width: '500px', 
      height: '300px' 
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle dialog close
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileSidebar() {
    // Check if user is logged in
    if (!this.isUserLogged) {
      // Redirect to login/signup if not logged in
      this.router.navigate(['/auth/signup']);
      return;
    }
    
    this.isProfileSidebarOpen = !this.isProfileSidebarOpen;
    this.isCart = false;
  }

  onProfileSidebarClosed() {
    this.isProfileSidebarOpen = false;
  }

  toggleCartMenu() {
    this.isCart = !this.isCart;
    this.isProfileSidebarOpen = false;
    this.cartDataGet();
  }

  cartRemove(id: any) {
    this.addToCartService.removeToCart(id).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.cartDataGet(); // refresh list
        this.addToCartService.decreaseCartCount(); // instant update
      },
      error => {
        this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  }

  logoutUser() {
    this.router.navigate(['/auth/signin']);
  }

  home() {
    this.router.navigate(['/delivery/home']);
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
    this.router.navigate(['/delivery/product']);
  }

  checkout() {
    this.router.navigate(['/delivery/place-order']);
  }
}