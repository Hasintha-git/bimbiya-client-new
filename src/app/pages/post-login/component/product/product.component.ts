import { Component, OnInit, Input } from '@angular/core';
import { ScheduleOrderComponent } from '../schedule-order/schedule-order.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { CartDetails } from 'src/app/models/cart-details';

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
  constructor(   
    public dialog: MatDialog,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cartModel.personCount =4;
    this.initialForm();
  }

  initialForm() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  
  onChange(product: any) {
    console.log("this.cartModel.personCount >", this.cartModel.personCount);

    // Check if the person count is 4 and set the initial product price
    if (!this.cartModel.isPriceChange) {
      this.cartModel.productPrice = product.price;
    }

    // Handle the change event logic here
    console.log('Selection changed:', this.myControl.value);
    const personCount = +this.myControl.value; // Use + to cast the value to a number

    this.cartModel.isPriceChange = true;
    if (!isNaN(personCount) && personCount !== 0) {
      console.log("Calculated value:", this.cartModel.personCount);
      var perProductPrice = this.cartModel.productPrice / 4;
      console.log("perProductPrice:", perProductPrice);
      product.price = perProductPrice * this.cartModel.personCount;
    } else {
      console.log("Invalid person count");
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
  scheduleOrder() {
    const dialogRef = this.dialog.open(ScheduleOrderComponent, { width: '550px', height: '220px' });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
