import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface DocumentResponseDTO {
  id: number;
  name: string;
  filename: string;
  fileType: string;
  url: string;
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  reviewer?: string;
}

export interface BankAccountDTO {
  id: number;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  verified: boolean;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationAdminKycService {

  private baseUrl = 'http://localhost:8080/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('jwtToken') || ''}`
    })
  };

  constructor(private http: HttpClient) {}

  getPendingEmployeeDocuments(orgId: number): Observable<DocumentResponseDTO[]> {
    return this.http.get<DocumentResponseDTO[]>(`${this.baseUrl}/documents/${orgId}/pending`, this.httpOptions);
  }

  reviewEmployeeDocument(documentId: number, approve: boolean, rejectionReason?: string): Observable<any> {
    const body = { approve, rejectionReason };
    return this.http.post(`${this.baseUrl}/documents/${documentId}/review`, body, this.httpOptions);
  }

  getPendingEmployeeBankAccounts(orgId: number): Observable<BankAccountDTO[]> {
    return this.http.get<BankAccountDTO[]>(`${this.baseUrl}/bank-accounts/organization/${orgId}`, this.httpOptions);
  }

  reviewEmployeeBankAccountKyc(orgId: number, bankAccountId: number, approve: boolean, rejectionReason?: string): Observable<any> {
    const params = new URLSearchParams();
    params.set('approve', approve.toString());
    if (rejectionReason) params.set('rejectionReason', rejectionReason);
    const url = `${this.baseUrl}/bank-accounts/organization/${orgId}/employee-bank-accounts/${bankAccountId}/kyc-approval?${params.toString()}`;
    return this.http.post(url, {}, this.httpOptions);
  }
  
}
