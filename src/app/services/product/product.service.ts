import { HttpClient, HttpErrorResponse,HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonFunctionService } from "../common-functions/common-function.service";
import { SECURE, getEndpoint } from "src/app/utility/constants/end-point";
import { Observable, throwError } from "rxjs";
import { DataTable } from "src/app/pages/models/data-table";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  requestUrl: string;

  constructor(public httpClient: HttpClient,public commonFunctionService: CommonFunctionService) { 
    this.requestUrl = `${getEndpoint(SECURE)}/product/v1`;
  }

  
  getSearchData(full: boolean): Observable<any> {
    const params = new HttpParams().set('full', full.toString());
    return this.httpClient.get(this.requestUrl + `/search-reference-data`, {
      responseType: 'json',
      params: params
    });
  }

  getList(searchParamMap: Map<string, string>): Observable<DataTable<any>> {
    const httpParams = this.commonFunctionService.getDataTableHttpParam(searchParamMap);
    return this.httpClient.get(this.requestUrl + `/client/filter-list`, {
      params: httpParams,
      responseType: 'json'
    });
  }

  getTrendingList(): Observable<DataTable<any>> {
    return this.httpClient.get(this.requestUrl + `/trending-list`, {
      responseType: 'json'
    });
  }


  get(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl + `/find-id`, object, { responseType: 'json' });
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      // The backend returned a 401 status code, indicating authentication failure.
      errorMessage = error.error.msg;
    } else if (error.status === 400) {
      // The backend returned a 400 status code, indicating authentication failure.
      errorMessage = error.error.msg;
    } else if (error.status === 500) {
      // The backend returned a 400 status code, indicating authentication failure.
      errorMessage = 'Application Error Please Contact System Administrator';
    }
    else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMessage = `${error.error.msg}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  };
  
}
