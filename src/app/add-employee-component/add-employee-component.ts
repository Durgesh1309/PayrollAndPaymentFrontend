import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-employee-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-employee-component.html',
  styleUrl: './add-employee-component.css'
})
export class AddEmployeeComponent {
  @Input() orgId: number = 0;

  employeeForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  backendBaseUrl = 'http://localhost:8080';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.employeeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      employeeCode: ['', Validators.required],
      designation: [''],
      department: [''],
    dateOfJoining: [new Date().toISOString().substring(0, 10)]  // Optionally add date validators if needed
    });
  }

  addEmployee() {
    if (!this.orgId) {
      this.errorMessage = 'Organization ID is missing.';
      this.successMessage = null;
      return;
    }
    if (this.employeeForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      this.successMessage = null;
      return;
    }
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      this.errorMessage = 'User not authenticated.';
      this.successMessage = null;
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = `${this.backendBaseUrl}/api/organization/${this.orgId}/employee/add`;

    this.http.post(url, this.employeeForm.value, { headers, responseType: 'text' }).subscribe({
      next: () => {
        this.successMessage = 'Employee added successfully!';
        this.errorMessage = null;
        this.employeeForm.reset();
      },
      error: err => {
        this.errorMessage = err.error || 'Failed to add employee.';
        this.successMessage = null;
      }
    });
  }
}
