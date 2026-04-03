import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { ProductService } from 'src/app/services/product/product.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { finalize, tap } from 'rxjs';
import { CommonFunctionService } from 'src/app/services/common-functions/common-function.service';
import { DataTable } from 'src/app/pages/models/data-table';
import { Product } from 'src/app/models/product';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ElementRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('productGrid') productGrid!: ElementRef;

  private destroy$ = new Subject<void>();

  portionList: SimpleBase[] = [];
  ingredientsList: SimpleBase[] = [];
  productList: Product[] = [];
  productCatList: SimpleBase[] = [];

  productFilter!: FormGroup;
  section: string = 'Single Bite';
  isClosed = false;
  productCategory: string = 'SINGLE_BITE';
  selectedPortions: string[] = [];
  selectedIngredients: number[] = [];
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private toast: ToastServiceService,
    private commonFunctionService: CommonFunctionService,
    private fb: FormBuilder,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.productCategory = this.storage.getCategory() || 'SINGLE_BITE';

    this.productFilter = this.fb.group({
      toPrice: [''],
      fromPrice: ['']
    });

    this.productService.categoryChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(category => {
        this.productCategory = category;
        const found = this.productCatList.find(c => c.code === category);
        this.section = found ? found.description : category;
        this.selectedPortions = [];
        this.selectedIngredients = [];
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.prepareReferenceData();
        this.getList();
      });

    this.prepareReferenceData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getList();
    }, 0);

    this.paginator.page.pipe(
      tap(() => this.getList())
    ).subscribe();
  }

  get filteredPortionList(): SimpleBase[] {
    if (this.productCategory === 'SINGLE_BITE') {
      return this.portionList.filter(p => p.code === 'single');
    }
    return this.portionList;
  }

  getList(): void {
    this.isLoading = true;

    let params = this.commonFunctionService.getDataTableParam(this.paginator);
    params.set('productCategory', this.productCategory);

    if (this.selectedPortions.length) params.set('portion', this.selectedPortions.join(','));
    if (this.selectedIngredients.length) params.set('ingredientList', this.selectedIngredients.join(','));

    const { toPrice, fromPrice } = this.productFilter.value;
    if (toPrice) params.set('toPrice', toPrice);
    if (fromPrice) params.set('fromPrice', fromPrice);

    this.productService.getList(params).pipe(
      finalize(() => {
        this.isLoading = false;
        setTimeout(() => this.scrollToGridTop(), 100);
      })
    ).subscribe({
      next: (data: DataTable<Product>) => {
        this.productList = data.records;
        this.paginator.length = data.totalRecords;
      },
      error: () => {
        this.toast.errorMessage('Error loading products');
      }
    });
  }

  private scrollToGridTop(): void {
    if (this.productGrid) {
      this.productGrid.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  applyFilters(): void {
    if (this.paginator) this.paginator.pageIndex = 0;
    if (window.innerWidth < 1024) this.isClosed = false;
    this.getList();
  }

  categoryChange(type: string): void {
    if (this.productCategory === type) return;
    this.productCategory = type;

    const found = this.productCatList.find(c => c.code === type);
    this.section = found ? found.description : type;

    this.selectedPortions = [];
    this.selectedIngredients = [];
    this.prepareReferenceData();
    this.applyFilters();
  }

  onPortionChange(code: string): void {
    const idx = this.selectedPortions.indexOf(code);
    idx > -1 ? this.selectedPortions.splice(idx, 1) : this.selectedPortions.push(code);
    this.applyFilters();
  }

  onIngredientChange(id: number): void {
    const idx = this.selectedIngredients.indexOf(id);
    idx > -1 ? this.selectedIngredients.splice(idx, 1) : this.selectedIngredients.push(id);
    this.applyFilters();
  }

  prepareReferenceData(): void {
    this.productService.getSearchDataWithCat(true, this.productCategory).subscribe(res => {
      this.portionList = res.portionList;
      this.ingredientsList = res.ingredientsList;
      this.productCatList = res.productCatList;

      const found = this.productCatList.find(c => c.code === this.productCategory);
      if (found) this.section = found.description;
    });
  }

  toggleMobileMenu(): void {
    this.isClosed = !this.isClosed;
  }

  @HostListener('document:click', ['$event'])
  onOutsideClick(event: MouseEvent): void {
    const btn = document.getElementById('mobile-view');
    const sidebar = document.getElementById('mobile-sidebar');
    if (
      this.isClosed &&
      btn && !btn.contains(event.target as Node) &&
      sidebar && !sidebar.contains(event.target as Node)
    ) {
      this.isClosed = false;
    }
  }

  resetFilters(): void {
    this.selectedPortions = [];
    this.selectedIngredients = [];
    this.productFilter.reset();
    this.productCategory = 'SINGLE_BITE';
    this.section = 'Single Bite';
    this.isClosed = false;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb: any) => cb.checked = false);
    this.prepareReferenceData();
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}