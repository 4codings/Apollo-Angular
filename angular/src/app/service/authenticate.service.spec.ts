import { TestBed, inject } from '@angular/core/testing';

import { AuthenticateService } from './authenticate.service';

describe('AuthenticateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticateService]
    });
  });

  it('should be created', inject([AuthenticateService], (service: AuthenticateService) => {
    expect(service).toBeTruthy();
  }));
});
