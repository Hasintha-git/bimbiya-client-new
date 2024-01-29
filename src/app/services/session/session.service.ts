import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionTimeout = 900000; // 15 minute
  // private sessionTimeout = 7500; // 0.5 minute
  private timer: any;
   _sessionExpired = new BehaviorSubject<boolean>(false);

  constructor() {
    this.startTimer();
  }

  get sessionExpired() {
    return this._sessionExpired.asObservable();
  }

  resetTimer() {
    clearTimeout(this.timer);
    this.startTimer();
  }

   startTimer() {
    this.timer = setTimeout(() => {
      this._sessionExpired.next(true);
    }, this.sessionTimeout);
  }
}
