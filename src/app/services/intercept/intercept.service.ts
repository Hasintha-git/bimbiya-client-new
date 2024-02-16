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
    const authToken = this.storageService.getSession(); 

    // const authToken ="eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJoYXNpbnRoYSIsImV4cCI6MTcwNjgxMjU0M30.lvCkhjELizrifregMhi-PlyQMiSpaQzdttHEHAfqBdpTF539X1WJ9E55Fl4LWiwXlaBqmEK7uPgIxSxgOEls5DWBUHzyqN6kNiFFBej4irmfZRLU4XTpQMbdjaTIvA_UVoxzeFV2IM2JAuv6hwZ6F8g3V2BmXQGLFA4i33qiPemSWnDrg1n5aVtwo4v9w4V70JK3THaAO1e8mjvvVJQRRTCvZB9HzAqdOl6mKq5X0syF8U0SLjlvNhzDFy9-IteaQ-v4O3O7exozp838cX9zlXcnJWxfSbLFfqVSFY_atEmeMMu_bsJ63dkEtvlkxP4eHU-14MJlgzImU8Az-p6KKw"

    
    if (authToken) {
      // Clone the request and add the 'Authorization' header
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${authToken}`
          // 'Authorization': `${authToken}`
        }
      });
    }
    return next.handle(request);
  }
}
