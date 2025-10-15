import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankAccountDTO, OrganizationAdminKycService } from '../Services/organization-admin-kyc-service';

@Component({
  selector: 'app-bank-kyc-review-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop">
      <div class="modal-panel">
        <h3>Review Bank Account KYC</h3>
        <p><strong>Account Holder:</strong> {{ bankAccount.accountHolderName }}</p>
        <p><strong>Account Number:</strong> {{ bankAccount.accountNumber }}</p>
        <p><strong>IFSC Code:</strong> {{ bankAccount.ifscCode }}</p>
        <p><strong>Bank Name:</strong> {{ bankAccount.bankName }}</p>

        <label>
          <input type="radio" [(ngModel)]="approve" [value]="true" /> Approve
        </label>
        <label>
          <input type="radio" [(ngModel)]="approve" [value]="false" /> Reject
        </label>

        <div *ngIf="!approve">
          <textarea placeholder="Rejection reason" [(ngModel)]="rejectionReason"></textarea>
        </div>

        <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>

        <button (click)="submit()" [disabled]="submitting">{{ submitting ? 'Submitting...' : 'Submit' }}</button>
        <button (click)="cancel()" [disabled]="submitting">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.4);
      display: flex;
      justify-content:center;
      align-items:center;
      z-index: 1000;
    }
    .modal-panel {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      max-width: 400px;
      width: 100%;
    }
    textarea {
      width: 100%;
      height: 80px;
      margin-top: 0.5rem;
      font-size: 1rem;
    }
    .error { color: red; margin-top: 0.5rem; }
    button { margin-right: 0.5rem; margin-top: 1rem; }
  `]
})
export class BankKycReviewModalComponent {
  @Input() bankAccount!: BankAccountDTO;
  @Input() orgId!: number;
  @Output() close = new EventEmitter<void>();

  approve = true;
  rejectionReason = '';
  submitting = false;
  errorMessage = '';

  constructor(private service: OrganizationAdminKycService) {}

  submit() {
    this.errorMessage = '';
    this.submitting = true;
    this.service.reviewEmployeeBankAccountKyc(this.orgId, this.bankAccount.id, this.approve, this.approve ? undefined : this.rejectionReason)
      .subscribe({
        next: () => {
          this.submitting = false;
          this.close.emit();
        },
        error: (err) => {
          this.errorMessage = 'Failed to submit KYC review: ' + (err.message || 'Unknown error');
          this.submitting = false;
        }
      });
  }

  cancel() {
    this.close.emit();
  }
}
