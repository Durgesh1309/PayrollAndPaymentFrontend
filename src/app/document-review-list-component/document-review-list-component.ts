import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { DocumentReviewModalComponent } from '../document-review-modal-component/document-review-modal-component';
import { DocumentResponseDTO, OrganizationAdminKycService } from '../Services/organization-admin-kyc-service';

@Component({
  selector: 'app-document-review-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DocumentReviewModalComponent],
  template: `
    <div *ngIf="loading">Loading documents...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
    <table *ngIf="!loading && documents.length" class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Filename</th>
          <th>Status</th>
          <th>Reviewer</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let doc of documents">
          <td>{{ doc.name }}</td>
          <td><a [href]="doc.url" target="_blank">{{ doc.filename }}</a></td>
          <td>{{ doc.verificationStatus }}</td>
          <td>{{ doc.reviewer || 'Not Reviewed' }}</td>
          <td><button (click)="openReview(doc)">Review</button></td>
        </tr>
      </tbody>
    </table>

    <app-document-review-modal
      *ngIf="showModal && selectedDocument"
      [document]="selectedDocument"
      (close)="onReviewComplete()">
    </app-document-review-modal>
  `,
  styles: [`
    .error { color: red; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { border: 1px solid #ccc; padding: 8px; }
    th { background-color: #f4f4f4; }
  `]
})
export class DocumentReviewListComponent implements OnInit {
  @Input() orgId!: number;
  @Output() reviewCompleted = new EventEmitter<void>();

  documents: DocumentResponseDTO[] = [];
  loading = false;
  error = '';

  selectedDocument?: DocumentResponseDTO;
  showModal = false;

  constructor(private service: OrganizationAdminKycService) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;
    this.error = '';
    this.service.getPendingEmployeeDocuments(this.orgId).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load documents: ' + (err.message || err.statusText);
        this.loading = false;
      }
    });
  }

  openReview(document: DocumentResponseDTO) {
    this.selectedDocument = document;
    this.showModal = true;
  }

  onReviewComplete() {
    this.showModal = false;
    this.selectedDocument = undefined;
    this.loadDocuments();
    this.reviewCompleted.emit();
  }
}
