import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take, tap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth/auth.service';
import { LoginService } from '../login/login.service';
import {
  ANOTHER_USER_LOGGED_ERROR_CODE,
  ANOTHER_USER_LOGGED_ERROR_DES,
  FORBIDDEN_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  INTERNAL_SERVER_ERROR_DES,
  NOT_ALLOWED,
  REFRESH_TOKEN_EXPIRED,
  SESSION_TIME_OUT_ERROR_CODE,
  SESSION_TIME_OUT_ERROR_DES,
  TOKEN_EXPIRED_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  UNAUTHORIZED_ERROR_DES
} from '../../utility/constants/message-var-list';
import { ToastServiceService } from '../toast/toast-service.service';
import { MatCardLgImage } from '@angular/material/card';

@Injectable({
  providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {
  private activeRequests = 0;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private storageService: StorageService,
    private loginService: LoginService,
    private toastService: ToastServiceService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    this.addRequest();
    this.showSpinner();
    const authToken = this.storageService.getSession();

    if (authToken) {
      request = this.addToken(request, authToken);
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Response handling logic can go here
        }
      }),
      finalize(() => {
        this.hideSpinner();
      })
    )
      .pipe(
      catchError((error: HttpErrorResponse): any => {
        if (error.status === FORBIDDEN_ERROR_CODE) {
          return this.handleExpiredToken(request, next);
        } else if (error.status === REFRESH_TOKEN_EXPIRED) {
          this.toastService.warningMessage(SESSION_TIME_OUT_ERROR_DES);
          this.authService.logOut();
          return throwError(() => error);
        } else if (error.status === SESSION_TIME_OUT_ERROR_CODE) {
          this.toastService.warningMessage(SESSION_TIME_OUT_ERROR_DES);
          this.authService.logOut();
          return throwError(() => error);
        } else if (error.status === ANOTHER_USER_LOGGED_ERROR_CODE) {
          this.toastService.errorMessage(ANOTHER_USER_LOGGED_ERROR_DES);
          this.authService.logOut();
        } else if (error.status === UNAUTHORIZED_ERROR_CODE) {
          this.toastService.errorMessage(UNAUTHORIZED_ERROR_DES);
          this.authService.logOut();
        } else if (error.status === NOT_ALLOWED) {
          this.toastService.errorMessage(INTERNAL_SERVER_ERROR_DES);
          this.authService.logOut();
        } else if (error.status === INTERNAL_SERVER_ERROR_CODE) {
          this.toastService.errorMessage(INTERNAL_SERVER_ERROR_DES);
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.removeRequest();
        this.hideSpinner();
      })
    );
  }

  private handleExpiredToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      let session = this.storageService.getSession();
      this.storageService.setSession(this.storageService.getRefreshToken());
      this.storageService.setRefreshToken(session);
      return this.loginService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          if (!token.jwt) {
            this.authService.logOut();
            return throwError("Both access token and refresh token expired.");
          }
          this.storageService.setSession(token.jwt);
          this.storageService.setRefreshToken(token.refreshToken);
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addToken(request, token.jwt));
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logOut();
          return throwError(error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => next.handle(this.addToken(request, jwt))),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    if (request.url.includes('/auth/refresh_token')) {
      const refresh_token = this.storageService.getRefreshToken();
      return request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Token': `Bearer ${refresh_token}`
        }
      });
    } else {
      return request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
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
