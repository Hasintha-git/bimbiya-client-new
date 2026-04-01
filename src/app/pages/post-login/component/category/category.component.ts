import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { ProductService } from 'src/app/services/product/product.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  biteCategories: SimpleBase[] = [];
  showBitePicker = false;

  constructor(
    private router: Router,
    private storage: StorageService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.getSearchData(false).subscribe(res => {
      this.biteCategories = (res.productCatList as SimpleBase[])
        .filter(c => c.code === 'BITE' || c.code === 'SINGLE_BITE');
    });
  }

  routeToProduct(type: string) {
    if (type === 'BITE') {
      this.showBitePicker = true;
    } else {
      this.storage.setCategory(type);
      this.productService.triggerCategoryChange(type);
      this.router.navigate(['/delivery/product']);
    }
  }

  closeBitePicker() {
    this.showBitePicker = false;
  }

  selectBiteCategory(code: string) {
    this.showBitePicker = false;
    this.storage.setCategory(code);
    this.productService.triggerCategoryChange(code);
    this.router.navigate(['/delivery/product']);
  }
}