import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { ProductService } from 'src/app/services/product/product.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { finalize, tap } from 'rxjs';
import { CommonFunctionService } from 'src/app/services/common-functions/common-function.service';
import { DataTable } from 'src/app/pages/models/data-table';
import { Product } from 'src/app/models/product';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Data
  portionList: SimpleBase[] = [];
  ingredientsList: SimpleBase[] = [];
  productList: Product[] = [];
  
  // State
  productFilter!: FormGroup;
  section: string = "Products";
  isClosed = false;
  productCategory: string = 'BITE';
  selectedPortions: string[] = [];
  selectedIngredients: number[] = [];

  constructor(
    private productService: ProductService,
    private toast: ToastServiceService,
    private commonFunctionService: CommonFunctionService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.productCategory = this.storage.getCategory() || "BITE";
    this.section = this.productCategory === "BITE" ? "Bite Section" : "Beverages";
    
    this.productFilter = this.fb.group({
      toPrice: [''],
      fromPrice: ['']
    });

    this.prepareReferenceData();
    this.getList();
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(
      tap(() => {
        this.scrollToTop();
        this.getList();
      })
    ).subscribe();
  }

  // CORE LOGIC
  private applyFilters() {
    this.paginator.pageIndex = 0;
    // Auto-close menu if on mobile device
    if (window.innerWidth < 1024) {
      this.isClosed = false;
    }
    this.getList();
  }

  getList() {
    this.spinner.show();
    let params = this.commonFunctionService.getDataTableParam(this.paginator);
    
    params.set("productCategory", this.productCategory);
    if (this.selectedPortions.length) params.set("portion", this.selectedPortions.join(','));
    if (this.selectedIngredients.length) params.set("ingredientList", this.selectedIngredients.join(','));
    
    const { toPrice, fromPrice } = this.productFilter.value;
    if (toPrice) params.set("toPrice", toPrice);
    if (fromPrice) params.set("fromPrice", fromPrice);

    this.productService.getList(params).pipe(
      finalize(() => {
        this.spinner.hide();
        this.scrollToTop();
      })
    ).subscribe({
      next: (data: DataTable<Product>) => {
        this.productList = data.records;
        this.paginator.length = data.totalRecords;
      },
      error: (err) => this.toast.errorMessage("Error loading products")
    });
  }

  resetFilters() {
    this.selectedPortions = [];
    this.selectedIngredients = [];
    this.productFilter.reset();
    this.productCategory = 'BITE'; 
    this.isClosed = false;
    
    // Visually uncheck all boxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb: any) => cb.checked = false);

    this.applyFilters();
  }

  // HANDLERS
  categoryChange(type: string) {
    if (this.productCategory === type) return;
    this.productCategory = type;
    this.section = type === "BITE" ? "Bite Section" : "Beverages";
    this.selectedPortions = [];
    this.selectedIngredients = [];
    this.applyFilters();
  }

  onPortionChange(code: string) {
    const idx = this.selectedPortions.indexOf(code);
    idx > -1 ? this.selectedPortions.splice(idx, 1) : this.selectedPortions.push(code);
    this.applyFilters();
  }

  onIngredientChange(id: number) {
    const idx = this.selectedIngredients.indexOf(id);
    idx > -1 ? this.selectedIngredients.splice(idx, 1) : this.selectedIngredients.push(id);
    this.applyFilters();
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prepareReferenceData() {
    this.productService.getSearchData(true).subscribe(res => {
      this.portionList = res.portionList;
      this.ingredientsList = res.ingredientsList;
    });
  }

  toggleMobileMenu() { this.isClosed = !this.isClosed; }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent) {
    const btn = document.getElementById('mobile-view');
    const sidebar = document.getElementById('mobile-sidebar');
    if (this.isClosed && btn && !btn.contains(event.target as Node) && sidebar && !sidebar.contains(event.target as Node)) {
      this.isClosed = false;
    }
  }
}