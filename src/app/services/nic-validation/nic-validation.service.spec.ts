import { TestBed } from '@angular/core/testing';

import { NicValidationService } from './nic-validation.service';

describe('NicValidationService', () => {
  let service: NicValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NicValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
