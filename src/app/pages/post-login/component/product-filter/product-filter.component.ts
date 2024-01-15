import { AfterViewInit, Component, OnInit,ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit,AfterViewInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public statusList: SimpleBase[];
  public portionList: SimpleBase[];
  public ingredientsList: SimpleBase[];
  public productCatList: SimpleBase[];
  public dataSource: Commondatasource;
  public productList: Product[];
  public searchModel: Product;

  isSort = false;
  isCategory = true;
  isPortion= true;
  isIngredient= true;
  isClosed= false;
  isMobileView= false;
  
  minValue = 0;
  maxValue = 10000;
  stepValue = 10;
  selectedMinValue = 100;
  selectedMaxValue = 1000;

  currentPage = 1;
  itemsPerPage = 4; // Adjust as needed
  totalItems: number;

  products = [];

  constructor(
    private productService: ProductService,
    public toast: ToastServiceService,
    private commonFunctionService: CommonFunctionService,
    private spinner: NgxSpinnerService,
    ) { }


    ngOnInit(): void {
      this.spinner.show();
      // Initialize the paginator after the view has been initialized
      setTimeout(() => {
        this.paginator.pageSize = this.itemsPerPage;
      });
      this.prepareReferenceData();
      this.initialDataLoader();
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
    this.paginator.pageSize = 5;
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

  getList() {
    let searchParamMap = this.commonFunctionService.getDataTableParam(this.paginator);
    // if (this.isSearch) {
    //   searchParamMap = this.getSearchString(searchParamMap, this.searchModel);
    // }
    this.productService.getList(searchParamMap)
      .subscribe((data: DataTable<Product>) => {
        this.productList = data.records;
        console.log("---->",this.productList)
        this.dataSource.datalist = this.productList;
        console.log(this.dataSource)
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

  toggleCloseMenu(){
    this.isClosed = !this.isClosed;
  }
}
