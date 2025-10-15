import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankKycReviewListComponent } from './bank-kyc-review-list-component';

describe('BankKycReviewListComponent', () => {
  let component: BankKycReviewListComponent;
  let fixture: ComponentFixture<BankKycReviewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankKycReviewListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankKycReviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
