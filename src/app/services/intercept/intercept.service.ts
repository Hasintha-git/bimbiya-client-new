import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { StorageService } from '../storage/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {

  constructor(
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
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
      finalize(() => {
        this.spinner.hide();
      }),
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.spinner.hide();
          this.storageService.clear();
        }
        this.spinner.hide();
        return throwError(error);
      })
    );
  }
}
