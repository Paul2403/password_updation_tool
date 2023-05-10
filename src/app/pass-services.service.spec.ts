import { TestBed } from '@angular/core/testing';

import { PassServicesService } from './pass-services.service';

describe('PassServicesService', () => {
  let service: PassServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
