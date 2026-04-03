import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, debounceTime, map, startWith } from 'rxjs';
import { CartDetails } from 'src/app/models/cart-details';
import { AddToCartService } from 'src/app/services/Cart/add-to-cart.service';
import { CommonResponse } from 'src/app/models/CommonResponse';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Router } from '@angular/router';
import { IngredientsDialogComponent } from './ingredients-dialog/ingredients-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent implements OnInit {
  @Input() product: any;

  myControl = new FormControl('');
  options: number[] = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  cartModel = new CartDetails();
  filteredOptions: Observable<string[]>;
  activeUser: any;

  isAddingToCart: boolean = false;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private cartService: AddToCartService,
    public toastService: ToastServiceService,
    private storageService: StorageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.activeUser = this.storageService.getUser();
    if (this.product.productCategory === 'BEVERAGES') {
      this.product.personCount = 1;
    } else {
      this.product.personCount = 4;
    }
    this.initialForm();
  }

  initialForm(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  openIngredientsDialog(): void {
    this.dialog.open(IngredientsDialogComponent, {
      data: { product: this.product },
      panelClass: 'ingredients-dialog-panel',
      backdropClass: 'ingredients-backdrop',
      maxWidth: '95vw',
      width: '420px',
      autoFocus: false,
    });
  }

  peronCountUp(product: any): void {
    if (!this.product.priceChange) {
      product.productBasicPrice = product.price;
      product.perPersonPrice = product.productBasicPrice / this.product.personCount;
    }
    if (product.productCategory === 'BITE') {
      if (this.product.personCount < 50) {
        this.product.personCount = this.product.personCount + 2;
        product.price = product.perPersonPrice * this.product.personCount;
        this.product.priceChange = true;
      }
    } else {
      this.product.personCount = this.product.personCount + 1;
      product.price = product.perPersonPrice * this.product.personCount;
      this.product.priceChange = true;
    }
  }

  peronCountDown(product: any): void {
    if (!this.product.priceChange) {
      product.productBasicPrice = product.price;
      product.perPersonPrice = product.productBasicPrice / this.product.personCount;
    }
    if (product.productCategory === 'BITE') {
      if (this.product.personCount > 4) {
        this.product.personCount = this.product.personCount - 2;
        product.price = product.perPersonPrice * this.product.personCount;
        this.product.priceChange = true;
      }
    } else {
      if (this.product.personCount > 1) {
        this.product.personCount = this.product.personCount - 1;
        product.price = product.perPersonPrice * this.product.personCount;
        this.product.priceChange = true;
      }
    }
  }

  countUp(product: any): void {
    if (!this.product.priceChange) {
      product.productBasicPrice = product.price;
      product.perPersonPrice = product.productBasicPrice / this.product.personCount;
    }
    if (this.product.personCount < 10) {
      this.product.personCount = this.product.personCount + 1;
      product.price = product.perPersonPrice * this.product.personCount;
      this.product.priceChange = true;
    }
  }

  countDown(product: any): void {
    if (!this.product.priceChange) {
      product.productBasicPrice = product.price;
      product.perPersonPrice = product.productBasicPrice / this.product.personCount;
    }
    if (this.product.personCount > 1) {
      this.product.personCount = this.product.personCount - 1;
      product.price = product.perPersonPrice * this.product.personCount;
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
    return option;
  }

  trackByIngredient(index: number, ingredient: any): number {
    return ingredient.id;
  }

  signIn(): void {
    this.router.navigate(['/auth/signin']);
  }

  addToCart(): void {
    this.activeUser = this.storageService.getUser();
    if (!this.activeUser) {
      return this.signIn();
    }

    this.cartModel.productPrice = this.product.price;
    this.cartModel.packageId = this.product.packageId;
    this.cartModel.userName = this.activeUser;
    this.cartModel.personCount = this.product.personCount;
    this.cartModel.status = 'active';
    this.cartModel.qty = 1;

    this.isAddingToCart = true;
    this.cdr.markForCheck(); 

    this.cartService.addToCart(this.cartModel).subscribe(
      (response: CommonResponse) => {
        this.isAddingToCart = false;
        this.cdr.markForCheck();
        this.toastService.successMessage(response.responseDescription);
      },
      error => {
        this.isAddingToCart = false;
        this.cdr.markForCheck();
        this.toastService.errorMessage(error.error['errorDescription']);
      }
    );
  }
}