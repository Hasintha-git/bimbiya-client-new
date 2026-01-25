import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

  get(key: string): any {
    return localStorage ? localStorage.getItem(key) : null;
  }

  set(key: string, value: any): void {
    if (localStorage) {
      localStorage.setItem(key, value);
    }
  }

  setSession(token: string): void {
    sessionStorage.setItem('session', token);
  }

  setRefreshToken(token: string): void {
    sessionStorage.setItem('refresh_token', token);
  }

  setUser(user: any): void {
    sessionStorage.setItem('user', user);
  }


  getUser(): string {
    return sessionStorage.getItem('user');
  }

  setFullName(user: any): void {
    sessionStorage.setItem('fullName', user);
  }

  getFullName(): string {
    return sessionStorage.getItem('fullName');
  }

  setCategory(type: string): void {
    sessionStorage.setItem('category', type);
  }

  getCategory(): string {
    return sessionStorage.getItem('category');
  }
  setPwd(pwd: string): void {
    sessionStorage.setItem('pwd', pwd);
  }

  getPwd(): string {
    return sessionStorage.getItem('pwd');
  }


  getRefreshToken():string {
    try {
      let session = sessionStorage.getItem('refresh_token');
      return session;
    } catch (ex) {
      return null;
    }
  }

  getSession():string {
    try {
      let session = sessionStorage.getItem('session');
      return session;
    } catch (ex) {
      return null;
    }
  }


  clear() {
    sessionStorage.clear();
  }


}
