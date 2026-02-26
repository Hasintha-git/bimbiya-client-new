import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 🔥 global auth state
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasSession());

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  // ---------- AUTH STATE ----------

  private hasSession(): boolean {
    return !!this.storageService.getSession();
  }

  isAuthenticated(): boolean {
    return this.hasSession();
  }

  isChildAuthenticated(): boolean {
    return this.hasSession();
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  // ---------- ACTIONS ----------

  logIn(): void {
    this.loggedInSubject.next(true);
    this.router.navigate(['/delivery/product']);
  }

  logOut(): void {
    this.storageService.clear();
    this.loggedInSubject.next(false);
    this.router.navigate(['/auth/signin']);
  }

  readySession(): void {
    this.storageService.clear();
    this.loggedInSubject.next(false);
    this.router.navigateByUrl('/auth/signin');
  }
}
