import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.addRequest();
    this.showSpinner();
    const authToken = this.storageService.getSession();

    if (authToken) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${authToken}`
        }
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Response handling logic can go here
        }
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.storageService.clear();
        }
        return throwError(error);
      }),
      finalize(() => {
        this.removeRequest();
        this.hideSpinner();
      })
    );
  }

  private addRequest(): void {
    this.activeRequests++;
  }

  private removeRequest(): void {
    this.activeRequests--;
  }

  private showSpinner(): void {
    if (this.activeRequests === 1) {
      this.spinner.show();
    }
  }

  private hideSpinner(): void {
    if (this.activeRequests === 0) {
      this.spinner.hide();
    }
  }
}
