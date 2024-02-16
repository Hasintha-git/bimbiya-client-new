import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  toDay : string;
  public id: any;

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService) {
  }


  ngOnInit(): void {
    const today = new Date();

const year = today.getFullYear();
const month = today.getMonth() + 1; // Adding 1 to get the actual month number (zero-based index)
const day = today.getDate();
    this.toDay = year+"-"+month+"-"+day;
  }

  private handleUnauthorizedError() {
    // Clear token and navigate to the login page
    this.router.navigate(['/login']);
    localStorage.removeItem('token');
  }
}
