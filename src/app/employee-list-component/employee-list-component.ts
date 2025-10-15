import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssignSalaryTemplateComponent } from '../assign-salary-template-component/assign-salary-template-component';

export interface Employee {
  id: number;
  fullName: string;
  email: string;
  designation: string;
  salaryTemplateName?: string;
}

@Component({
  selector: 'app-employee-list-component',
  standalone: true,
  imports: [FormsModule, CommonModule, AssignSalaryTemplateComponent],
  templateUrl: './employee-list-component.html',
  styleUrls: ['./employee-list-component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployeeId: number | null = null;
  orgId: number = Number(localStorage.getItem('organizationId'));

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    if (!this.orgId || this.orgId === 0) {
      console.error('Organization ID not found. Cannot load employees.');
      return;
    }
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<Employee[]>(
      `http://localhost:8080/api/organization/${this.orgId}/employee`, 
      { headers }
    ).subscribe({
      next: data => this.employees = data,
      error: err => {
        if (err.status === 403) {
          console.error('Access denied: You are not authorized to view this data.');
        } else {
          console.error('Failed to load employees.', err);
        }
        this.employees = [];
      }
    });
  }

openAssignTemplate(employeeId: number | undefined): void {
  if (!employeeId) {
    console.error("Selected employee has no ID!", employeeId);
    return;
  }
  console.log("hello from parent, opening modal with id:", employeeId);
  this.selectedEmployeeId = employeeId;
}


  onAssignmentComplete() {
    this.selectedEmployeeId = null;
    this.loadEmployees();
  }
}
