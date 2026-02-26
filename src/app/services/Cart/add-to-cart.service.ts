import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonFunctionService } from "../common-functions/common-function.service";
import { getEndpoint } from "src/app/utility/constants/end-point";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {

  private requestUrl: string;

  // 🔥 Cart count state (shared across app)
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private commonFunctionService: CommonFunctionService
  ) {
    this.requestUrl = `${getEndpoint()}/cart/v1/client-cart`;
  }

  /* =======================
     CART STATE HELPERS
     ======================= */

  setCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }

  increaseCartCount(): void {
    this.cartCountSubject.next(this.cartCountSubject.value + 1);
  }

  decreaseCartCount(): void {
    const current = this.cartCountSubject.value;
    this.cartCountSubject.next(current > 0 ? current - 1 : 0);
  }

  clearCartCount(): void {
    this.cartCountSubject.next(0);
  }

  /* =======================
     API CALLS
     ======================= */

  addToCart(object: any): Observable<any> {
    return this.httpClient
      .post(this.requestUrl + `/add-to-cart`, object, { responseType: 'json' })
      .pipe(
        tap(() => this.increaseCartCount()), // 🔥 instant navbar update
        catchError(this.handleError)
      );
  }

  removeToCart(id: any): Observable<any> {
    return this.httpClient
      .delete(this.requestUrl + `/remove-to-cart/${id}`, { responseType: 'json' })
      .pipe(
        tap(() => this.decreaseCartCount()), // 🔥 instant navbar update
        catchError(this.handleError)
      );
  }

  findCartList(object: any): Observable<any> {
    return this.httpClient
      .post(this.requestUrl + `/get-to-cart`, object, { responseType: 'json' })
      .pipe(
        tap((res: any) => {
          // 🔥 sync cart count from backend
          if (res?.records) {
            this.setCartCount(res.records.length);
          }
        }),
        catchError(this.handleError)
      );
  }

  checkoutCartList(object: any): Observable<any> {
    return this.httpClient
      .post(this.requestUrl + `/get-to-checkout`, object, { responseType: 'json' })
      .pipe(catchError(this.handleError));
  }

  /* =======================
     ERROR HANDLING
     ======================= */

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 400:
        case 401:
          errorMessage = error.error?.msg || 'Unauthorized request';
          break;
        case 500:
          errorMessage = 'Application Error. Please contact System Administrator';
          break;
        default:
          errorMessage = error.error?.msg || 'Something went wrong';
      }
    }
    return throwError(() => errorMessage);
  }
}
