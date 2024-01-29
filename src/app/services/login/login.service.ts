import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {getEndpoint, SECURE} from '../../utility/constants/end-point';

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



}
