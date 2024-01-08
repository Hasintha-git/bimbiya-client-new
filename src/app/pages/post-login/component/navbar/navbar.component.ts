import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgetPasswordComponent } from 'src/app/pages/pre-login/forget-password/forget-password.component';
import { UserProfileComponent } from 'src/app/pages/pre-login/user-profile/user-profile.component';

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
  
  itemsList: any[] = [
    { name: 'Item 1', quantity: 3 },
    { name: 'Item 2', quantity: 1 },
    { name: 'Item 3', quantity: 2 }
  ];

  constructor(private router: Router,public dialog: MatDialog) { }


  profileMgt() {
    this.router.navigate(['/user-profile']);
  }

  forgetPassword() {
    this.isProfile = false;
    const dialogRef = this.dialog.open(ForgetPasswordComponent, { data: 12, width: '500px', height: '300px' });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnInit(): void {
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
    this.router.navigate(['/post-login/foods']);
  }
}
