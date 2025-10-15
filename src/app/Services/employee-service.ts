import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/api'; // update as needed

  constructor(private http: HttpClient) {}

  getEmployeeProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employee/self`, {headers: this.authHeaders()});
  }

  uploadDocument(orgId: number | undefined, employeeId: number | undefined, documentName: string, file: File): Observable<any> {
    if (!orgId || !employeeId) {
      console.error('uploadDocument: orgId or employeeId is undefined', { orgId, employeeId });
      return throwError(() => new Error('Organization ID or Employee ID missing'));
    }
    const formData = new FormData();
    formData.append('orgId', orgId.toString());
    formData.append('employeeId', employeeId.toString());
    formData.append('documentName', documentName);
    formData.append('file', file);

    // DO NOT set Content-Type header for multipart/form-data
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('jwtToken') || ''}`);
    return this.http.post(`${this.baseUrl}/documents/upload`, formData, { headers });
  }

  getPendingDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/documents/pending`, { headers: this.authHeaders() });
  }

 submitBankDetails(employeeId: number, bankDetails: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bank-accounts/employee/${employeeId}`, bankDetails, { headers: this.authHeaders() });
}


  private authHeaders(includeContentType = true): HttpHeaders {
    const token = localStorage.getItem('jwtToken') || '';
    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (includeContentType) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }
}
