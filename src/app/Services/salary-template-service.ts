import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaryTemplateService {
  private baseUrl = '/api/employee';
  constructor(private http: HttpClient) {}

  assignTemplateToEmployee(employeeId: number, templateId: number): Observable<any> {
    const url = `${this.baseUrl}/assign-template/${employeeId}/${templateId}`;
    return this.http.post(url, {}); // No request body
  }
}
