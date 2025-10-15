import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { authHeaders } from './http-headers.util'; // path relative to this file

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ApiResponseDTO {
  success: boolean;
  message: string;
}

const API_BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class ChangePasswordService {
  constructor(private http: HttpClient) {}

  changePassword(orgId: number, employeeId: number, body: ChangePasswordRequest):
    Observable<ApiResponseDTO | string> {
    const url = `${API_BASE}/organization/${orgId}/employees/${employeeId}/profile/password`;
    return this.http.patch<ApiResponseDTO | string>(url, body, { headers: authHeaders() });
  }
}
