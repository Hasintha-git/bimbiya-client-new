import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { ProductService } from 'src/app/services/product/product.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { debounceTime, finalize, merge, tap } from 'rxjs';
import { Commondatasource } from 'src/app/pages/datasource/Commondatasource';
import { CommonFunctionService } from 'src/app/services/common-functions/common-function.service';
import { DataTable } from 'src/app/pages/models/data-table';
import { Product } from 'src/app/models/product';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  productFilter: FormGroup;
  statusList: SimpleBase[];
  portionList: SimpleBase[];
  ingredientsList: SimpleBase[];
  productCatList: SimpleBase[];
  dataSource: Commondatasource;
  productList: Product[];
  searchModel: Product;
  section: string = "Bimbiya Product";

  isSort = false;
  isCategory = true;
  isPortion = true;
  isIngredient = true;
  isClosed = false;
  isMobileView = false;

  minValue = 0;
  maxValue = 10000;
  stepValue = 10;
  selectedMinValue = 100;
  selectedMaxValue = 1000;

  currentPage = 1;
  itemsPerPage = 4; // Adjust as needed
  totalItems: number;

  productCategory: string;
  productCategoryChange: boolean = false;
  products = [];
  isBite = false;
  isBeverages = false;
  portionChange = false;
  ingredientsChange = false;

  portion: string[] = [];
  ingredientList: number[] = [];

  constructor(
    private productService: ProductService,
    private toast: ToastServiceService,
    private commonFunctionService: CommonFunctionService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private storage: StorageService
  ) {}

  ngOnInit(): void {
    this.searchModel = new Product();
    this.productCategory = this.storage.getCategory() || "BITE";
    this.section = this.productCategory === "BITE" ? "Bite Section" : "Beverages";
    this.isBite = this.productCategory === "BITE";
    this.isBeverages = this.productCategory !== "BITE";

    this.initialValidator();
    this.paginator.pageSize = this.itemsPerPage;
    this.prepareReferenceData();
    this.initialDataLoader();
  }

  onPageChange() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  initialValidator() {
    this.productFilter = this.formBuilder.group({
      foods: new FormControl({ value: this.isBite, disabled: this.isBite }),
      beverages: new FormControl({ value: this.isBeverages, disabled: this.isBeverages }),
      status: new FormControl(''),
      toPrice: new FormControl(''),
      fromPrice: new FormControl(''),
      portion: new FormControl(''),
      ingredient: new FormControl(''),
    });

    this.setControlState('foods', this.isBite);
    this.setControlState('beverages', this.isBeverages);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const cart1 = document.getElementById('mobile-view');
    if (!cart1 || !cart1.contains(event.target as Node)) {
      this.isClosed = false;
    }
  }

  categoryChange(type: string) {
    this.productCategoryChange = true;
    this.productCategory = type;
    this.section = type === "BITE" ? "Bite Section" : "Beverages";
    this.isBite = type === "BITE";
    this.isBeverages = type !== "BITE";
    this.setControlState('foods', this.isBite);
    this.setControlState('beverages', this.isBeverages);
    this.getList();
  }

  private setControlState(controlName: string, isDisabled: boolean) {
    const control = this.productFilter.get(controlName);
    if (isDisabled) {
      control?.disable();
    } else {
      control?.enable();
    }
  }
  prepareReferenceData(): void {
    this.productService.getSearchData(true).subscribe(
      (response: any) => {
        this.statusList = response.statusList;
        this.portionList = response.portionList;
        this.ingredientsList = response.ingredientsList;
        this.productCatList = response.productCatList;
      },
      error => {
        this.toast.errorMessage(error.error['message']);
      }
    );
  }

  initialDataLoader(): void {
    this.initialDataTable();
    this.dataSource = new Commondatasource();
    this.dataSource.counter$.pipe(
      tap((count) => {
        this.paginator.length = count;
      })
    ).subscribe();
    this.getList();
  }

  initialDataTable() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.itemsPerPage;
  }

  ngAfterViewInit() {
    this.dataSource.counter$.pipe(
      tap((count) => {
        this.paginator.length = count;
      })
    ).subscribe();
    merge(this.paginator.page).pipe(
      tap(() => this.getList())
    ).subscribe();
  }

  onPortionChange(portionId: string): void {
    this.portionChange = true;
    this.toggleSelection(this.portion, portionId);
    this.getList();
  }

  onIngredientChange(ingredientId: number): void {
    this.ingredientsChange = true;
    this.toggleSelection(this.ingredientList, ingredientId);
    this.getList();
  }

  toggleSelection<T>(list: T[], item: T): void {
    const index = list.indexOf(item);
    if (index !== -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }
  }

  getList() {
    this.spinner.show();
    if (this.productCategoryChange || this.portionChange || this.ingredientsChange) {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 4;
    }
    let searchParamMap = this.commonFunctionService.getDataTableParam(this.paginator);
    searchParamMap = this.getSearchString(searchParamMap, this.searchModel);

    this.productService.getList(searchParamMap).pipe(
      tap(), // Debugging: Confirm when API request starts
      finalize(() => {
        this.portionChange = false;
        this.ingredientsChange = false;
        this.spinner.hide();
      }) // Hide spinner after API response or error
    ).subscribe(
      (data: DataTable<Product>) => {
        this.productList = data.records;
        this.dataSource.datalist = this.productList;
        this.dataSource.usersSubject.next(this.productList);
        this.dataSource.countSubject.next(data.totalRecords);
      },
      error => {
        this.toast.errorMessage(error.error['errorDescription']);
        this.spinner.hide(); // Ensure spinner hides even on error
      }
    );

  }


  getSearchString(searchParamMap: Map<string, any>, searchModel: Product): Map<string, string> {
    const controls = this.productFilter.controls;

    if(this.productCategory == 'BITE') {
      if (controls.toPrice.value) {
        searchParamMap.set("toPrice", controls.toPrice.value);
      }
      if (controls.fromPrice.value) {
        searchParamMap.set("fromPrice", controls.fromPrice.value);
      }
      if (this.portion.length) {
        searchParamMap.set("portion", this.portion.join(','));
      }
      if (this.ingredientList.length) {
        searchParamMap.set("ingredientList", this.ingredientList.join(','));
      }
    }
    searchParamMap.set("productCategory", this.productCategory);
    return searchParamMap;
  }

  toggleSortMenu() {
    this.isSort = !this.isSort;
  }

  toggleCategoryMenu() {
    this.isCategory = !this.isCategory;
  }

  togglePortionMenu() {
    this.isPortion = !this.isPortion;
  }

  toggleIngredientMenu() {
    this.isIngredient = !this.isIngredient;
  }

  onRangeChange() {
    // Handle the range change logic here
  }

  toggleCloseMenu() {
    this.isClosed = !this.isClosed;
  }

  get foods() {
    return this.productFilter.get('foods');
  }
  get beverages() {
    return this.productFilter.get('beverages');
  }
  get portionForm() {
    return this.productFilter.get('portion');
  }
  get ingredientForm() {
    return this.productFilter.get('ingredient');
  }
}
