import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ScheduleOrderComponent } from '../schedule-order/schedule-order.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { CartDetails } from 'src/app/models/cart-details';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: any;
  myControl = new FormControl('');
  options: number[] = [2, 4,6,8,10,12,14,16,18,20,22,24,26,28,30];

  cartModel= new CartDetails();
  filteredOptions: Observable<string[]>;
  activeUser:string;
  constructor(   
    public dialog: MatDialog,
    private fb: FormBuilder,
    private cartService: AddToCartService,
    
    public toastService: ToastServiceService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    private router: Router,) { }

  ngOnInit(): void {
    
    this.activeUser=this.storageService.getUser();
    this.product.personCount =4;
    this.initialForm();
    
  }

  initialForm() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  
  peronCountUp(product: any) {
    if (!this.product.priceChange) {
      product.productBasicPrice =product.price;
      product.perPersonPrice = product.productBasicPrice / this.product.personCount;
    }
    if(this.product.personCount <50) {
      this.product.personCount =this.product.personCount+2;
  
      product.price =product.perPersonPrice * this.product.personCount;
      this.product.priceChange = true;
    }
  }

  peronCountDown(product: any) {

    if (!this.product.priceChange) {
      product.productBasicPrice =product.price;
      product.perPersonPrice = product.productBasicPrice / this.product.personCount;
    }

    if(this.product.personCount > 4) {
      this.product.personCount =this.product.personCount-2;
      product.price =product.perPersonPrice * this.product.personCount;
      this.product.priceChange = true;
    }

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
  
    return this.options
      .filter(option => option.toString().toLowerCase().includes(filterValue))
      .map(option => option.toString());
  }
  

  trackOption(index: number, option: any): any {
    return option; // Replace with a unique identifier for each option if possible
  }

  signIn() {
    
    this.router.navigate(['/auth/signin']);
  }

  addToCart() {
    
    if(this.activeUser == null) {
      return this.signIn();
    }
    this.cartModel.productPrice=this.product.price;
    this.cartModel.packageId=this.product.packageId;
    this.cartModel.userName=this.activeUser;
    this.cartModel.personCount=this.product.personCount;
    this.cartModel.status="active";
    this.cartModel.qty=1;

    this.cartService.addToCart(this.cartModel).subscribe(
      (response: CommonResponse) => {
        this.toastService.successMessage(response.responseDescription);
        
      },
      error => {
        
          this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  }
}
