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

  readySession(): void {
    this.storageService.clear();
    this.router.navigateByUrl('/auth/signin');
  }


  logIn(): void {
    this.router.navigate(['/post-login/product']);
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
      if (session) {
        return true;
      }
      return false;
    
    } catch (ex) {
      return false;
    }
  }
}
