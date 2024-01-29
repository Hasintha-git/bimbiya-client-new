import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class Interceptor implements HttpInterceptor  {

  constructor(
    private storageService: StorageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.storageService.getSession(); // Get the token from your storage service

    
    if (authToken) {
      // Clone the request and add the 'Authorization' header
      request = request.clone({
        setHeaders: {
          // 'Authorization': `Bearer ${authToken}`
          'Authorization': `${authToken}`
        }
      });
    }
    console.log("############",request)
    return next.handle(request);
  }
}
