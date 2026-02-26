import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { getEndpoint } from 'src/app/utility/constants/end-point';
import { CommonFunctionService } from '../common-functions/common-function.service';
import { UserProfileUpdateDTO } from 'src/app/models/UserProfileUpdateDTO';

export interface UserProfile {
  fullName: string;
  email: string;
  mobileNo: string;
  address: string;
  city: string;
  district: string;
  userName?: string;
  createdDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  requestUrl: string;

  constructor(
    public httpClient: HttpClient,
    public commonFunctionService: CommonFunctionService
  ) {
    this.requestUrl = `${getEndpoint()}/user/v1`;
  }

  /**
   * Get user profile by username
   * @param userName - The username to fetch profile for
   * @returns Observable<any>
   */
  getUserProfile(mobileNo: string): Observable<any> {
    const params = new HttpParams().set('mobileNo', mobileNo);
    return this.httpClient.get(this.requestUrl + `/find-mobileNo`, {
      responseType: 'json',
      params: params
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateUserProfile(userProfileUpdateDTO: UserProfileUpdateDTO): Observable<any> {
    return this.httpClient.put(this.requestUrl + `/profile-update`, userProfileUpdateDTO, {
      responseType: 'json'
    }).pipe(
      catchError(this.handleError)
    );
  }


  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 401 || error.status === 400) {
      errorMessage = error.error.msg || 'Authentication failure.';
    } else if (error.status === 500) {
      errorMessage = 'Application Error. Please Contact System Administrator.';
    } else if (error.status === 404) {
      errorMessage = 'User Not Found';
    } else {
      errorMessage = error.error.msg || 'Unknown error occurred.';
    }
    return throwError(errorMessage);
  }
}