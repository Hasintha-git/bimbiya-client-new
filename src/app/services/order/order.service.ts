import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {catchError, Observable,throwError} from 'rxjs';
import { getEndpoint } from 'src/app/utility/constants/end-point';
import { CommonFunctionService } from '../common-functions/common-function.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  requestUrl: string;
  requestUrlPreLogin: string;

  constructor(public httpClient: HttpClient,public commonFunctionService: CommonFunctionService) { 
    this.requestUrl = `${getEndpoint()}/order/v1/admin-order`;
    this.requestUrlPreLogin = `${getEndpoint()}/auth`;
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


    getUserOrderDetails(mobileNo: string): Observable<any> {
    const params = new HttpParams().set('mobileNo', mobileNo);
    return this.httpClient.get(`${getEndpoint()}/order/v1`+ `/order-details/mobile-no`, {
      responseType: 'json',
      params: params
    }).pipe(
      catchError(this.handleError)
    );
  }

  getOrderByMobileNo(mobileNo: string): Observable<any> {
    const params = new HttpParams().set('mobileNo', mobileNo);
    return this.httpClient.get(`${getEndpoint()}/order/v1`+ `/admin-order/find-id`, {
      responseType: 'json',
      params: params
    }).pipe(
      catchError(this.handleError)
    );
  }

  getOrderById(orderId: number): Observable<any> {
    const params = new HttpParams().set('orderId', orderId.toString());
    return this.httpClient.get(`${getEndpoint()}/order/v1`+ `/order-details`, {
      responseType: 'json',
      params: params
    }).pipe(
      catchError(this.handleError)
    );
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
