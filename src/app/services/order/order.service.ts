import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import {Observable,throwError} from 'rxjs';
import { getEndpoint, SECURE } from 'src/app/utility/constants/end-point';
import {timeout} from 'rxjs/operators';
import { DataTable } from 'src/app/pages/models/data-table';
import { CommonFunctionService } from '../common-functions/common-function.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  requestUrl: string;
  requestUrlPreLogin: string;

  constructor(public httpClient: HttpClient,public commonFunctionService: CommonFunctionService) { 
    this.requestUrl = `${getEndpoint(SECURE)}/order/v1/admin-order`;
    this.requestUrlPreLogin = `${getEndpoint(SECURE)}/auth`;
  }

  placeOrder(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+ `/place-order`, object, { responseType: 'json' });
  }

  getSearchData(full: boolean): Observable<any> {
    const params = new HttpParams().set('full', full.toString());
    return this.httpClient.get(this.requestUrl + `/search-reference-data`, {
      responseType: 'json',
      params: params
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 401 || error.status === 400) {
      errorMessage = error.error.msg || 'Authentication failure.';
    } else if (error.status === 500) {
      errorMessage = 'Application Error. Please Contact System Administrator.';
    } else if ( error.status === 404 ) {
      errorMessage = 'User Not Found';
    }else {
      errorMessage = error.error.msg || 'Unknown error occurred.';
    }
    return throwError(errorMessage); // Ensure the error message is returned
  }
  
  
}
