import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {getEndpoint, SECURE} from '../../utility/constants/end-point';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private requestUrl: string = `${getEndpoint(SECURE)}/auth`;
  private tokenRequestUrl: string = `${getEndpoint(SECURE)}/token/refresh`;

  constructor(private httpClient: HttpClient) {
  }

  login(object: any): any {
    const headers = new HttpHeaders({
      'module': 'client'
    });
    return this.httpClient.post(this.requestUrl+'/authenticate', object, {    headers: headers,observe: 'response'});
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
  
// In your login service
refreshToken() {
  let httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  return this.httpClient.post(this.tokenRequestUrl, {}, {
    observe: 'response', // Get the full HttpResponse
    headers: httpHeaders,
    responseType: 'json',
  }).pipe(
    // Directly tapping into the response to extract and store tokens might be handled here or after subscription
    map(response => {
      const tokens = {
        jwt: response.headers.get('token'),
        refreshToken: response.headers.get('refresh_token')
      };
      return tokens;
    })
  );
}



}
