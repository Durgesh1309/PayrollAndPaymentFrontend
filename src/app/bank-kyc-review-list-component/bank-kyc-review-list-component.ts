import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BankAccountDTO, OrganizationAdminKycService } from '../Services/organization-admin-kyc-service';
import { FormsModule } from '@angular/forms';
import { BankKycReviewModalComponent } from '../bank-kyc-review-modal-component/bank-kyc-review-modal-component';

@Component({
  selector: 'app-bank-kyc-review-list',
  standalone: true,
  imports: [CommonModule,FormsModule,BankKycReviewModalComponent],
 template: `
<div *ngIf="loading">Loading bank accounts...</div>
<div *ngIf="error" class="error">{{ error }}</div>

<table *ngIf="!loading && bankAccounts.length" class="table">
  <thead>
    <tr>
      <th>Account Holder</th>
      <th>Account Number</th>
      <th>IFSC</th>
      <th>Bank Name</th>
      <th>KYC Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let acc of bankAccounts">
      <td>{{ acc.accountHolderName }}</td>
      <td>{{ acc.accountNumber }}</td>
      <td>{{ acc.ifscCode }}</td>
      <td>{{ acc.bankName }}</td>
      <td>{{ acc.kycStatus }}</td>
      <td><button (click)="openReview(acc)">Review</button></td>
    </tr>
  </tbody>
</table>

<app-bank-kyc-review-modal
  *ngIf="showModal && selectedBankAccount"
  [bankAccount]="selectedBankAccount"
  [orgId]="orgId"
  (close)="onReviewComplete()">
</app-bank-kyc-review-modal>
  `,
  styles: [`
    .error { color: red; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 8px; }
  `]
})
export class BankKycReviewListComponent implements OnInit {
 @Input() orgId!: number;
  @Output() reviewCompleted = new EventEmitter<void>();

  bankAccounts: BankAccountDTO[] = [];
  loading = false;
  error = '';

  selectedBankAccount?: BankAccountDTO;
  showModal = false;

  constructor(private service: OrganizationAdminKycService) {}

  ngOnInit() {
    this.loadBankAccounts();
  }

  loadBankAccounts() {
    this.loading = true;
    this.error = '';
    this.service.getPendingEmployeeBankAccounts(this.orgId).subscribe({
      next: accounts => {
        this.bankAccounts = accounts.filter(acc => acc.kycStatus === 'PENDING');
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load bank accounts';
        this.loading = false;
      }
    });
  }

  openReview(bankAccount: BankAccountDTO) {
    this.selectedBankAccount = bankAccount;
    this.showModal = true;
  }

  onReviewComplete() {
    this.showModal = false;
    this.selectedBankAccount = undefined;
    this.loadBankAccounts();
    this.reviewCompleted.emit();
  }
}
