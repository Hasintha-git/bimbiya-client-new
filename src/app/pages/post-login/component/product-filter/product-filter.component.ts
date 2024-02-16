import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SimpleBase } from 'src/app/models/SimpleBase';
import { ProductService } from 'src/app/services/product/product.service';
import { ToastServiceService } from 'src/app/services/toast/toast-service.service';
import { merge, tap } from 'rxjs';
import { Commondatasource } from 'src/app/pages/datasource/Commondatasource';
import { CommonFunctionService } from 'src/app/services/common-functions/common-function.service';
import { DataTable } from 'src/app/pages/models/data-table';
import { Product } from 'src/app/models/product';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  productFilter: FormGroup;
  public statusList: SimpleBase[];
  public portionList: SimpleBase[];
  public ingredientsList: SimpleBase[];
  public productCatList: SimpleBase[];
  public dataSource: Commondatasource;
  public productList: Product[];
  public searchModel: Product;

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

  // BEVERAGES
  productCategory: any;

  products = [];
  isBite: boolean = true;
  isBeverages: boolean = true;

  portion: string[] = []; 
  ingredientList: number[]= []; 
  constructor(
    private productService: ProductService,
    public toast: ToastServiceService,
    private commonFunctionService: CommonFunctionService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private storage: StorageService
  ) {

  }

  ngOnInit(): void {
    this.searchModel = new Product();
    this.spinner.show();

    const type=this.storage.getCategory();
    if(type != null) {
      this.productCategory =type;
    }else {
      this.productCategory = "BITE";
    }
    this.initialValidator();
    // Initialize the paginator after the view has been initialized
    setTimeout(() => {
      this.paginator.pageSize = this.itemsPerPage;
    });
    this.prepareReferenceData();
    if(this.productCategory) {
      this.initialDataLoader();
    }


  }


  initialValidator() {
    this.productFilter = this.formBuilder.group({
      foods: this.formBuilder.control('', []),
      beverages: this.formBuilder.control('', []),
      status: this.formBuilder.control('', []),
      toPrice: this.formBuilder.control('', []),
      fromPrice: this.formBuilder.control('', []),
      portion: this.formBuilder.control(''),
      ingredient: this.formBuilder.control(''),
    });

    // Subscribe to changes in the form
    this.productFilter.valueChanges.subscribe((formValues) => {
      this.getList();
    });

     // Subscribe to changes in the form
     this.productFilter.get('beverages').valueChanges.subscribe((beverages) => {
      this.isBeverages = this.productFilter.get('beverages').value;
      this.isBite = !this.productFilter.get('beverages').value;
      if(this.isBeverages) {
        this.productCategory = "BEVERAGES";
        this.getList();
      }
    });

    // Subscribe to changes in the form
    this.productFilter.get('foods').valueChanges.subscribe((foods) => {
      
      this.isBite = this.productFilter.get('foods').value;
      this.isBeverages = !this.productFilter.get('foods').value;
      if(this.isBite) {
        this.productCategory = "BITE";
        this.getList();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    const cart1 = document.getElementById('mobile-view');
  
    if ((cart1 && cart1.contains(event.target as Node))) {
      return;
    } else {
      this.isClosed = false;
    }
  }
  


  prepareReferenceData(): void {
    this.productService.getSearchData(true)
      .subscribe((response: any) => {
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
    this.dataSource.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
    this.getList();
  }

  initialDataTable() {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 4;
  }

  ngAfterViewInit() {
    this.dataSource.counter$
      .pipe(
        tap((count) => {
          this.paginator.length = count;
        })
      )
      .subscribe();
    merge(this.paginator.page)
      .pipe(
        tap(() => this.getList())
      )
      .subscribe();
  }

  onPortionChange(portionId: any): void {
    
    const index = this.portion.indexOf(portionId);
    if (index !== -1) {
      this.portion.splice(index, 1);
    } else {
      this.portion.push(portionId);
    }
  
    this.getList();
  }
  
  onIngredientChange(ingredientId: any): void {
    
    const index = this.ingredientList.indexOf(ingredientId);
    if (index !== -1) {
      this.ingredientList.splice(index, 1);
    } else {
      this.ingredientList.push(ingredientId);
    }
  
    this.getList();
  }
  

  getList() {
    this.spinner.show();
    let searchParamMap = this.commonFunctionService.getDataTableParam(this.paginator);
    searchParamMap = this.getSearchString(searchParamMap, this.searchModel);
    this.productService.getList(searchParamMap)
      .subscribe((data: DataTable<Product>) => {
        this.productList = data.records;
        this.dataSource.datalist = this.productList;
        this.dataSource.usersSubject.next(this.productList);
        this.dataSource.countSubject.next(data.totalRecords);
        this.spinner.hide();
      },
        error => {
          this.spinner.hide();
          this.toast.errorMessage(error.error['errorDescription']);
        }
      );
  }

  getSearchString(searchParamMap: Map<string, any>, searchModel: Product): Map<string, string> {
    if (this.productFilter.get('toPrice').value) {
      searchParamMap.set("toPrice", this.productFilter.get('toPrice').value);
    }

    if (this.productFilter.get('fromPrice').value) {
      searchParamMap.set("fromPrice", this.productFilter.get('fromPrice').value);
    }

    if (this.portion) {
      searchParamMap.set("portion",this.portion);
    }

    if (this.ingredientList) {
      searchParamMap.set("ingredientList", this.ingredientList);
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
