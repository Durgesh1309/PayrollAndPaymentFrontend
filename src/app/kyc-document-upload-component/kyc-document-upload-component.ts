import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../Services/employee-service';

@Component({
  selector: 'app-kyc-document-upload-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kyc-document-upload-component.html',
  styleUrls: ['./kyc-document-upload-component.css']
})
export class KycDocumentUploadComponent {
  @Input() employeeId!: number;
  @Input() orgId!: number;
  @Output() close = new EventEmitter<void>();

  selectedFile?: File;
  documentName: string = '';
  uploading = false;
  errorMessage = '';
  successMessage = '';


  bankAccountNumber: string = '';
  bankIfsc: string = '';
  accountHolderName: string = '';
  bankName: string = '';

  constructor(private employeeService: EmployeeService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files?.[0];
    this.errorMessage = '';
    this.successMessage = '';
  }

 uploadDocument() {
  this.errorMessage = '';
  this.successMessage = '';

  if (!this.documentName || !this.selectedFile) {
    this.errorMessage = "Please provide document name and file.";
    return;
  }
  if (!this.bankAccountNumber || !this.bankIfsc || !this.accountHolderName) {
    this.errorMessage = "Please complete bank details.";
    return;
  }

  this.uploading = true;

  let docSuccess = false;
  let bankSuccess = false;
  let docError = '';
  let bankError = '';

  // Trigger both uploads
  this.employeeService.uploadDocument(this.orgId, this.employeeId, this.documentName, this.selectedFile)
    .subscribe({
      next: () => {
        docSuccess = true;
        if (bankSuccess) this.handleUploadSuccess();
      },
      error: err => {
        docError = "Document upload failed: " + (err.message || 'Unknown error');
        this.showCombinedResult(docError, bankError);
      }
    });

  const bankDetails = {
    accountHolderName: this.accountHolderName,
    accountNumber: this.bankAccountNumber,
    ifscCode: this.bankIfsc,
    bankName: this.bankName || 'Unknown'
  };
  this.employeeService.submitBankDetails(this.employeeId, bankDetails)
    .subscribe({
      next: () => {
        bankSuccess = true;
        if (docSuccess) this.handleUploadSuccess();
      },
      error: err => {
        bankError = "Bank details submission failed: " + (err.message || 'Unknown error');
        this.showCombinedResult(docError, bankError);
      }
    });
}

handleUploadSuccess() {
  this.successMessage = "Document and bank details uploaded successfully, pending verification.";
  this.uploading = false;
  setTimeout(() => this.close.emit(), 1500);
}

showCombinedResult(docError: string, bankError: string) {
  this.errorMessage = [docError, bankError].filter(Boolean).join(' | ');
  this.uploading = false;
}


  cancel() {
    this.close.emit();
  }
}
