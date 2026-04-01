import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { CartDetails } from 'src/app/models/cart-details';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { ForgetPasswordComponent } from 'src/app/pages/pre-login/authentication/forget-password/forget-password.component';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProductService } from 'src/app/services/product/product.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isMobileMenuOpen = false;
  isProfileSidebarOpen = false;
  isCart = false;
  isBiteDropdownOpen = false;
  buttonHover: boolean = false;

  cartDetails = new CartDetails();
  public cartDetailsList: CartDetails[];
  activeUser: string;
  isUserLogged: boolean = false;
  activeFullName: string;
  cartCount: number = 0;

  // Bite sub-categories from API (filtered to BITE-family only)
  biteCategories: SimpleBase[] = [];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private addToCartService: AddToCartService,
    private toastService: ToastServiceService,
    private storageService: StorageService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

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
      setTimeout(() => { this.isProfileSidebarOpen = true; }, 100);
    }

    // Load bite sub-categories from API
    this.loadBiteCategories();
  }

  loadBiteCategories() {
    this.productService.getSearchData(false).subscribe(res => {
      // Filter only BITE-family: BITE and SINGLE_BITE (exclude BEVERAGES)
      this.biteCategories = (res.productCatList as SimpleBase[])
        .filter(c => c.code !== 'BEVERAGES');
    });
  }

navigateToBiteCategory(categoryCode: string) {
  this.isBiteDropdownOpen = false;
  this.storageService.setCategory(categoryCode);
  this.productService.triggerCategoryChange(categoryCode); // ← notify
  this.router.navigate(['/delivery/product']);
}

navigateToBeverages() {
  this.storageService.setCategory('BEVERAGES');
  this.productService.triggerCategoryChange('BEVERAGES'); // ← notify
  this.router.navigate(['/delivery/product']);
}

  toggleBiteDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isBiteDropdownOpen = !this.isBiteDropdownOpen;
    this.isCart = false;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const biteBtn = document.getElementById('biteMenuBtn');
    const biteDropdown = document.getElementById('biteDropdown');

    if (
      biteBtn && !biteBtn.contains(event.target as Node) &&
      biteDropdown && !biteDropdown.contains(event.target as Node)
    ) {
      this.isBiteDropdownOpen = false;
    }

    const cart = document.getElementById('cartBtn');
    if (cart && cart.contains(event.target as Node)) return;
    else this.isCart = false;

    const profile = document.getElementById('profileBtn');
    if (profile && profile.contains(event.target as Node)) return;

    const mobile = document.getElementById('mobileMenu');
    if (mobile && mobile.contains(event.target as Node)) return;
    else this.isMobileMenuOpen = false;
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
        error => {}
      );
    } else {
      this.logoutUser();
    }
  }

  forgetPassword() {
    this.isProfileSidebarOpen = false;
    const dialogRef = this.dialog.open(ForgetPasswordComponent, {
      data: 12, width: '500px', height: '300px'
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }

  toggleProfileSidebar() {
    if (!this.isUserLogged) {
      this.router.navigate(['/auth/signup']);
      return;
    }
    this.isProfileSidebarOpen = !this.isProfileSidebarOpen;
    this.isCart = false;
  }

  onProfileSidebarClosed() { this.isProfileSidebarOpen = false; }

  toggleCartMenu() {
    this.isCart = !this.isCart;
    this.isProfileSidebarOpen = false;
    this.cartDataGet();
  }

isBiteActive(): boolean {
  const cat = this.storageService.getCategory();
  return this.router.url.includes('/delivery/product') && cat !== 'BEVERAGES';
}

isBeveragesActive(): boolean {
  const cat = this.storageService.getCategory();
  return this.router.url.includes('/delivery/product') && cat === 'BEVERAGES';
}

  cartRemove(id: any) {
    this.addToCartService.removeToCart(id).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        this.cartDataGet();
        this.addToCartService.decreaseCartCount();
      },
      error => { this.toastService.errorMessage(error.error['errorDescription']); }
    );
  }

  logoutUser() { this.router.navigate(['/auth/signin']); }
  home() { this.router.navigate(['/delivery/home']); }
  accountCreate() { this.router.navigate(['/auth/signup']); }

  logout() {
    this.storageService.clear();
    this.isUserLogged = false;
    this.home();
  }

  checkout() { this.router.navigate(['/delivery/place-order']); }
}