import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankKycReviewModalComponent } from './bank-kyc-review-modal-component';

describe('BankKycReviewModalComponent', () => {
  let component: BankKycReviewModalComponent;
  let fixture: ComponentFixture<BankKycReviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankKycReviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankKycReviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
