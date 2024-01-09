import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CommonFunctionService } from '../common-functions/common-function.service';
import { SECURE, getEndpoint } from 'src/app/utility/constants/end-point';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {

  requestUrl: string;
  requestUrlPreLogin: string;

  constructor(public httpClient: HttpClient,public commonFunctionService: CommonFunctionService) { 
    this.requestUrl = `${getEndpoint(SECURE)}/cart/v1/client-cart`;
  }

  
  removeToCart(id: any): Observable<any> {
    return this.httpClient.delete(this.requestUrl+ `/remove-to-cart`+ `${id}`, {
      responseType: 'json'
    });
  }

  findCartList(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+`/get-to-cart`, object, { responseType: 'json' });
  }

  addToCart(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+`/add-to-cart`, object, { responseType: 'json' });
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
