import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddEmployeeComponent } from '../add-employee-component/add-employee-component';
import { SalaryTemplateComponent } from '../salary-template-component/salary-template-component';
import { EmployeeListComponent } from '../employee-list-component/employee-list-component';
import { DocumentReviewListComponent } from '../document-review-list-component/document-review-list-component';
import { BankKycReviewListComponent } from '../bank-kyc-review-list-component/bank-kyc-review-list-component';
import { DocumentReviewModalComponent } from '../document-review-modal-component/document-review-modal-component';


interface OrgDocumentStatus {
  id: number;
  name: string;
  filename: string;
  fileType: string;
  url: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  reviewer: string | null;
}

interface UserProfile {
  organizationId: number;
  organizationName: string;
  organizationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  username: string;
}

@Component({
  selector: 'app-organization-dash-board-component',
  standalone: true,
  imports: [CommonModule, FormsModule, AddEmployeeComponent, SalaryTemplateComponent,EmployeeListComponent,
    DocumentReviewListComponent,BankKycReviewListComponent],
  templateUrl: './organization-dash-board-component.html',
  styleUrls: ['./organization-dash-board-component.css']
})
export class OrganizationDashBoardComponent implements OnInit {
  orgName: string = '';
  username: string = '';
  userInitial: string = '';
  organizationId: number = 0;

  stepsCompleted: number = 0;
  totalSteps: number = 3;
  docStatus: OrgDocumentStatus | null = null;
  docStepStatus: string = 'NOT_UPLOADED';

  organizationStatus: string | null = null;
  payrollSetupUnlocked: boolean = false;
  salaryStructureUnlocked: boolean = false;
  selectedFile: File | null = null;
  backendBaseUrl = 'http://localhost:8080';

  // State for showing Add Employee panel
  showAddEmployeeForm: boolean = false;

  currentSection: string = 'dashboard'; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile(): void {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('User not authenticated. Please login.');
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.backendBaseUrl}/api/auth/user`;

    this.http.get<UserProfile>(url, { headers }).subscribe(
      user => {
        if (!user.organizationId || user.organizationId === 0) {
          alert('Invalid organization ID detected. Please contact admin or re-login.');
          return;
        }
        this.organizationId = user.organizationId;
        localStorage.setItem('organizationId', String(this.organizationId)); // Store for use in salary-template component
        this.orgName = user.organizationName || user.username || 'Organization';
        this.username = user.username || 'User';
        this.organizationStatus = user.organizationStatus;
        this.fetchDocumentStatus(headers);
      },
      error => {
        console.error('Failed to fetch profile', error);
        alert('Failed to load profile. Please try again.');
      }
    );
  }

  fetchDocumentStatus(headers: HttpHeaders): void {
    if (!this.organizationId || this.organizationId === 0) {
      console.warn('No organization ID available for fetching document status.');
      return;
    }
    const url = `${this.backendBaseUrl}/api/organization/${this.organizationId}/documents/status`;
    this.http.get<OrgDocumentStatus>(url, { headers, responseType: 'json' }).subscribe(
      resp => {
        this.docStatus = resp;
        this.docStepStatus = resp?.verificationStatus ?? 'NOT_UPLOADED';
        this.updateProgress();
      },
      error => {
        console.error('Failed to fetch document status', error);
        this.docStepStatus = 'NOT_UPLOADED';
        this.stepsCompleted = 0;
      }
    );
  }

  updateProgress(): void {
    if (this.organizationStatus === 'APPROVED' || this.docStepStatus === 'APPROVED') {
      this.stepsCompleted = this.totalSteps;
      this.payrollSetupUnlocked = true;
      this.salaryStructureUnlocked = true;
    } else if (this.docStepStatus === 'PENDING' || this.docStepStatus === 'REJECTED') {
      this.stepsCompleted = 1;
      this.payrollSetupUnlocked = false;
      this.salaryStructureUnlocked = false;
    } else {
      this.stepsCompleted = 0;
      this.payrollSetupUnlocked = false;
      this.salaryStructureUnlocked = false;
    }
  }

  refreshData() {
  
}

  onFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (!inputEl.files || inputEl.files.length === 0) {
      this.selectedFile = null;
      return;
    }
    const file = inputEl.files[0];
    if (file.type !== 'application/pdf' || file.size > 5 * 1024 * 1024) {
      alert('Please upload a PDF file smaller than 5MB.');
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }

  uploadDoc(): void {
    if (!this.organizationId || this.organizationId === 0) {
      alert('Cannot upload document: organization ID is missing. Please login again.');
      return;
    }
    if (!this.selectedFile) {
      alert('Please select a valid PDF file to upload.');
      return;
    }
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      alert('User not authenticated. Please login.');
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData = new FormData();
    formData.append('documentName', 'proof of Registration');
    formData.append('file', this.selectedFile);

    const url = `${this.backendBaseUrl}/api/organization/${this.organizationId}/documents/upload`;
    this.http.post<OrgDocumentStatus>(url, formData, { headers }).subscribe(
      resp => {
        this.docStatus = resp;
        this.docStepStatus = resp.verificationStatus || 'NOT_UPLOADED';
        this.updateProgress();
        this.selectedFile = null;
        alert('Upload successful!');
      },
      error => {
        console.error('Upload failed:', error);
        alert('Upload failed: ' + (error.error?.message || 'Unknown error'));
      }
    );
  }

  startPayrollSetup(): void {
    alert('Payroll setup started!');
  }

  setupSalaryStructure(): void {
    alert('Salary structure setup!');
  }

  // Sidebar handlers
  openAddEmployee() {
    if (this.organizationStatus === 'APPROVED') {
      this.showAddEmployeeForm = true;
      this.currentSection = 'add-employee';
    }
  }
  closeAddEmployee() {
    this.showAddEmployeeForm = false;
    this.currentSection = 'dashboard';
  }
  
  showSection(section: string) {
    this.currentSection = section;
  }
}
