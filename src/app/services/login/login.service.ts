import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {getEndpoint, SECURE} from '../../utility/constants/end-point';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private requestUrl: string = `${getEndpoint(SECURE)}/auth`;
  private tokenRequestUrl: string = `${getEndpoint(SECURE)}/token/refresh`;

  constructor(private httpClient: HttpClient) {
  }

  login(object: any): any {
    return this.httpClient.post(this.requestUrl+'/user-login', object, {observe: 'response'});
  }

  add(object: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+'/register', object, { responseType: 'json' });
  }

  otpConfirm(otp: number, username: any): Observable<any> {
    return this.httpClient.post(this.requestUrl+ `/otp-confirm/`+ `${otp}`+`/${username}`, {
      responseType: 'json'
    });
  }


  getSearchData(full: boolean): Observable<any> {
    const params = new HttpParams().set('full', full.toString());
    return this.httpClient.get(this.requestUrl + `/search-reference-data`, {
      responseType: 'json',
      params: params
    });
  }
  // login(credentials: any): Observable<HttpResponse<any>> {
  //   return this.httpClient.post<HttpResponse<any>>(this.requestUrl, credentials, { observe: 'response' });
  // }

  
  // login(object: any): Observable<HttpResponse<any>> {
  //   return this.httpClient.post<HttpResponse<any>>(this.requestUrl, object);
  // }
  



}
