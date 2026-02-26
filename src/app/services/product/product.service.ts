import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonFunctionService } from "../common-functions/common-function.service";
import { getEndpoint } from "src/app/utility/constants/end-point";
import { Observable, throwError, of } from "rxjs";
import { tap } from "rxjs/operators";
import { DataTable } from "src/app/pages/models/data-table";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  requestUrl: string;

  // 🔹 Cache config
  private TRENDING_CACHE_KEY = 'TRENDING_PRODUCTS_CACHE';
  private CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(
    public httpClient: HttpClient,
    public commonFunctionService: CommonFunctionService
  ) {
    this.requestUrl = `${getEndpoint()}/product/v1`;
  }

  // -------------------------------
  // SEARCH REFERENCE DATA
  // -------------------------------
  getSearchData(full: boolean): Observable<any> {
    const params = new HttpParams().set('full', full.toString());
    return this.httpClient.get(this.requestUrl + `/search-reference-data`, {
      responseType: 'json',
      params
    });
  }

  // -------------------------------
  // PRODUCT LIST (NO CACHE)
  // -------------------------------
  getList(searchParamMap: Map<string, string>): Observable<DataTable<any>> {
    const httpParams = this.commonFunctionService.getDataTableHttpParam(searchParamMap);
    return this.httpClient.get<DataTable<any>>(this.requestUrl + `/client/filter-list`, {
      params: httpParams,
      responseType: 'json'
    });
  }

  // -------------------------------
  // 🔥 TRENDING LIST (WITH CACHE)
  // -------------------------------
  getTrendingList(): Observable<DataTable<any>> {
    const cached = localStorage.getItem(this.TRENDING_CACHE_KEY);

    if (cached) {
      const parsed = JSON.parse(cached);
      const isValid = (Date.now() - parsed.timestamp) < this.CACHE_TTL;

      if (isValid) {
        // ✅ Serve from cache
        return of(parsed.data);
      }
    }

    // ❌ Cache expired or not found → API call
    return this.httpClient.get<DataTable<any>>(this.requestUrl + `/trending-list`, {
      responseType: 'json'
    }).pipe(
      tap(response => {
        localStorage.setItem(
          this.TRENDING_CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data: response
          })
        );
      })
    );
  }

  // -------------------------------
  // FIND BY ID
  // -------------------------------
  get(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl + `/find-id`, object, {
      responseType: 'json'
    });
  }

  // -------------------------------
  // OPTIONAL: MANUAL CACHE CLEAR
  // -------------------------------
  clearTrendingCache(): void {
    localStorage.removeItem(this.TRENDING_CACHE_KEY);
  }

  // -------------------------------
  // ERROR HANDLER
  // -------------------------------
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 401 || error.status === 400) {
      errorMessage = error.error.msg;
    } else if (error.status === 500) {
      errorMessage = 'Application Error Please Contact System Administrator';
    } else {
      errorMessage = `${error.error.msg}`;
    }

    return throwError(errorMessage);
  }
}
