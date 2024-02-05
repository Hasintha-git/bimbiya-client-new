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

  setUser(user: string): void {
    sessionStorage.setItem('user', user);
  }

  getUser(): string {
    return sessionStorage.getItem('user');
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

  setActiveSection(activeSection: string): void {
    sessionStorage.setItem('activeSection', activeSection);
  }

  getActiveSection(): string {
    return sessionStorage.getItem('activeSection');
  }

  setActivePage(activePage: string): void {
    sessionStorage.setItem('activePage', activePage);
  }

  getActivePage(): string {
    return sessionStorage.getItem('activePage');
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
      console.log("uuuuuuuuuuuuuu",session)
      return session;
    } catch (ex) {
      return null;
    }
  }

  setLeftMenu(leftMenu: string): void {
    sessionStorage.setItem('leftMenu', leftMenu);
  }

  getLeftMenu() {
    try {
      let leftMenu = sessionStorage.getItem('leftMenu');
      return leftMenu;
    } catch (ex) {
      return null;
    }
  }

  clear() {
    sessionStorage.clear();
  }


}
