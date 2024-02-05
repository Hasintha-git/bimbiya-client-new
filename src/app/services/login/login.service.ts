import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {getEndpoint, SECURE} from '../../utility/constants/end-point';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private requestUrl: string = `${getEndpoint(SECURE)}/auth/user-login`;
  private tokenRequestUrl: string = `${getEndpoint(SECURE)}/token/refresh`;

  constructor(private httpClient: HttpClient) {
  }

  login(object: any): any {
    return this.httpClient.post(this.requestUrl, object, {observe: 'response'});
  }

  // login(credentials: any): Observable<HttpResponse<any>> {
  //   return this.httpClient.post<HttpResponse<any>>(this.requestUrl, credentials, { observe: 'response' });
  // }

  
  // login(object: any): Observable<HttpResponse<any>> {
  //   return this.httpClient.post<HttpResponse<any>>(this.requestUrl, object);
  // }
  



}
