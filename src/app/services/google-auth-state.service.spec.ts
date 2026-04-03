import { TestBed } from '@angular/core/testing';

import { GoogleAuthStateService } from './google-auth-state.service';

describe('GoogleAuthStateService', () => {
  let service: GoogleAuthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAuthStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
