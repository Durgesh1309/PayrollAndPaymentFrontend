// admin-pending-documents-component.ts
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface OrganizationResponseDTO { id: number; name: string; }
interface DocumentResponseDTO {
  id: number;
  name: string;
  filename: string;
  fileType: string;
  url: string;
  verificationStatus: string;
  rejectionReason?: string;
  reviewer?: string;
}

@Component({
  selector: 'app-admin-pending-documents-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pending-documents-component.html',
  styleUrls: ['./admin-pending-documents-component.css'],
})
export class AdminPendingDocumentsComponent {
  organizations: OrganizationResponseDTO[] = [];
  selectedOrgId: number | null = null;
  pendingDocs: DocumentResponseDTO[] = [];
  showRejectModal = signal(false);
  rejectingDoc: DocumentResponseDTO | null = null;
  rejectionReason = signal('');
  isProcessing = signal(false); // for disables/feedback on API calls

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit(): void {
    this.fetchOrganizations();
    this.loadOrganizationsStats(); // initial dashboard update
  }

  fetchOrganizations() {
    this.http.get<OrganizationResponseDTO[]>('http://localhost:8080/api/bank-admin/organizations/pending', { headers: this.getAuthHeaders() })
      .subscribe(orgs => {
        this.organizations = orgs;
        if (orgs.length > 0) this.loadDocuments(orgs[0].id);
        else this.pendingDocs = [];
      });
  }

  loadDocuments(orgId: number | null) {
    if (orgId !== null) {
      this.selectedOrgId = orgId;
      this.http.get<DocumentResponseDTO[]>(`http://localhost:8080/api/bank-admin/organizations/${orgId}/documents/pending`, { headers: this.getAuthHeaders() })
        .subscribe(docs => this.pendingDocs = docs);
    }
  }

  approveDocument(doc: DocumentResponseDTO): void {
    this.isProcessing.set(true);
    const payload = { approve: true, rejectionReason: '' };
    this.http.post(`http://localhost:8080/api/documents/${doc.id}/review`, payload, { headers: this.getAuthHeaders(), responseType: 'text' })
      .subscribe(() => {
        doc.verificationStatus = 'VERIFIED';
        this.loadOrganizationsStats();
        this.isProcessing.set(false);
      }, () => this.isProcessing.set(false));
  }

  openRejectModal(doc: DocumentResponseDTO) {
    this.rejectingDoc = doc;
    this.rejectionReason.set('');
    this.showRejectModal.set(true);
  }

  submitReject() {
    if (!this.rejectingDoc) return;
    if (!this.rejectionReason()) {
      alert('Rejection reason is required');
      return;
    }
    this.isProcessing.set(true);
    const payload = { approve: false, rejectionReason: this.rejectionReason() };
    this.http.post(`http://localhost:8080/api/documents/${this.rejectingDoc.id}/review`, payload, { headers: this.getAuthHeaders(), responseType: 'text' })
      .subscribe(() => {
        this.rejectingDoc!.verificationStatus = 'REJECTED';
        this.showRejectModal.set(false);
        this.loadOrganizationsStats(); // refresh org status after rejection
        this.isProcessing.set(false);
      }, () => this.isProcessing.set(false));
  }

  cancelReject() {
    this.showRejectModal.set(false);
    this.rejectingDoc = null;
  }

  // Fetch organization stats or refresh dashboard stats after approval/rejection
  loadOrganizationsStats() {
    this.http.get<any[]>('http://localhost:8080/api/bank-admin/organizations/pending', { headers: this.getAuthHeaders() })
      .subscribe(orgs => {
        // Update your stats UI
        // Example: update your dashboard component's observable or stat vars
        // For now, just reload organization list
        this.fetchOrganizations();
      });
  }
}
