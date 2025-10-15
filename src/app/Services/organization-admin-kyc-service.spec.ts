import { TestBed } from '@angular/core/testing';

import { OrganizationAdminKycService } from './organization-admin-kyc-service';

describe('OrganizationAdminKycService', () => {
  let service: OrganizationAdminKycService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationAdminKycService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
