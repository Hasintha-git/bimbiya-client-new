import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private storageService: StorageService,
  ) {
  }


  logOut(): void {
    this.storageService.clear();
    this.router.navigate(['/']);
  }

  logIn(): void {
    // this.router.navigate(['/post-login/main/base/dashboard']);
    // this.storageService.setActiveSection('')
    console.log("ready to route")
    this.router.navigate(['/post-login/place-order']);
    console.log("after  route",this.router)
  }


  isAuthenticated(): boolean {
    try {
      let session = this.storageService.getSession();
      if (session) {
        return true;
      }
      return false;
    } catch (ex) {
      return false;
    }
  }

  isChildAuthenticated(): boolean {
    try {
      let session = this.isAuthenticated();
      console.log("kkkkkkkkk",session)
      if (session) {
        return true;
      }
      return false;
    
    } catch (ex) {
      return false;
    }
  }
}
