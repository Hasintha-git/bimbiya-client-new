import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent implements OnInit, OnChanges {
  @Input() isSidebarOpen: boolean = false;
  @Output() sidebarClosed = new EventEmitter<void>();
  
  activeFullName: string = 'Guest';
  activeOrderCount: number = 0; // Can be updated from order service

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    // TODO: Load active order count from order service
    // this.loadActiveOrders();
  }

    ngOnChanges(changes: SimpleChanges): void {
    // Reload user data whenever sidebar opens
    if (changes['isSidebarOpen'] && changes['isSidebarOpen'].currentValue === true) {
      this.loadUserData();
      // TODO: Also reload active orders when sidebar opens
      // this.loadActiveOrders();
    }
  }

  loadUserData(): void {
    console.log("called!");
    const fullName = this.storageService.getFullName();
    if (fullName) {
      this.activeFullName = fullName;
    }
  }

  getInitial(): string {
    if (this.activeFullName && this.activeFullName !== 'Guest') {
      return this.activeFullName.charAt(0).toUpperCase();
    }
    return 'G';
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
    this.sidebarClosed.emit();
  }

  navigateToOrderTracking(): void {
      const currentUrl = this.router.url;
  this.storageService.setItem('returnUrl', currentUrl);
  
    this.closeSidebar();
    this.router.navigate(['/delivery/order-tracking']);
  }

navigateToAccountSettings(): void {
  // Store the current route before navigating
  const currentUrl = this.router.url;
  this.storageService.setItem('returnUrl', currentUrl);
  
  this.closeSidebar();
  this.router.navigate(['/delivery/account-settings']);
}

  logout(): void {
    this.storageService.clear();
    this.closeSidebar();
     this.router.navigate(['/delivery/home']).then(() => {
    window.location.reload(); 
  });
  }
  

  // Optional: Method to update active order count
  updateActiveOrderCount(count: number): void {
    this.activeOrderCount = count;
  }
}