import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  isVisible = true;
  contentMargin = 240;
  activeRouter = "Dashboard";
  isSurveyShareEnble: boolean;


  constructor(private router: Router, private dialog: MatDialog) {
    this.isSurveyShareEnble = true;
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? this.titleChange(event.urlAfterRedirects): null

    })
  }


  titleChange(title:string) {
    let routUrl = title.replace('/user-profile/','')
    const rout = routUrl.split('?')[0];

    if (rout=='dashboard') {
      this.activeRouter = 'Dashboard';
    }else if (rout=='profile') {
      this.activeRouter = 'Profile Details'
    } 
  }
  ngOnInit(): void {
  }

  onMenuToggle() {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      this.contentMargin = 70;
    } else {
      this.contentMargin = 240;
    }
  }

  goToShopping() {
    this.router.navigate(['/post-login']);
  }

}
