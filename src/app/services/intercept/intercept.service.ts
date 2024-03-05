import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.addRequest(request);
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
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.storageService.clear();
        }
        return throwError(error);
      }),
      finalize(() => {
        this.removeRequest(request);
        this.hideSpinner();
      })
    );
  }

  private addRequest(request: HttpRequest<any>): void {
    this.requests.push(request);
  }

  private removeRequest(request: HttpRequest<any>): void {
    const index = this.requests.indexOf(request);
    if (index !== -1) {
      this.requests.splice(index, 1);
    }
  }

  private showSpinner(): void {
    if (this.requests.length === 1) {
      this.spinner.show();
    }
  }

  private hideSpinner(): void {
    if (this.requests.length === 0) {
      this.spinner.hide();
    }
  }
}
