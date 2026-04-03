import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleAuthStateService {
  private readonly STORAGE_KEY = 'google_auth_initiator';

  setInitiator(page: 'signin' | 'signup') {
    localStorage.setItem(this.STORAGE_KEY, page);
  }

  getInitiator(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}