import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TemplateFilterPipe } from './template-filter.pipe';

@Component({
  selector: 'app-salary-template-component',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule,TemplateFilterPipe,FormsModule],
  templateUrl: './salary-template-component.html',
  styleUrls: ['./salary-template-component.css']
})
export class SalaryTemplateComponent implements OnInit {
  salaryForm: FormGroup;
  orgId: number = Number(localStorage.getItem('organizationId'));
  creationSuccess: boolean = false;
  errorMessage: string = '';
  searchText: string = '';

  
  templates: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.salaryForm = this.fb.group({
      templateName: ['', Validators.required],
      basicSalary: [0, [Validators.required, Validators.min(0)]],
      hra: [0, [Validators.required, Validators.min(0)]],
      allowances: [0, [Validators.required, Validators.min(0)]],
      deductions: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    if (!this.orgId || this.orgId === 0) {
      this.errorMessage = 'Organization ID invalid. Cannot load templates.';
      return;
    }
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`http://localhost:8080/api/organization/${this.orgId}/salary-templates`, { headers })
      .subscribe({
        next: data => {
          this.templates = data;
          this.errorMessage = '';
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Failed to load salary templates.';
        }
      });
  }

  createTemplate(): void {
    if (this.salaryForm.invalid) {
      this.errorMessage = 'Please fill all fields with valid numbers.';
      return;
    }
    if (!this.orgId || this.orgId === 0) {
      this.errorMessage = 'Invalid organization. Please reload or re-login.';
      return;
    }
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`http://localhost:8080/api/organization/${this.orgId}/salary-templates`, 
      this.salaryForm.value, { headers })
      .subscribe({
        next: _ => {
          this.creationSuccess = true;
          this.errorMessage = '';
          this.salaryForm.reset();
          this.loadTemplates();  // Refresh list after creation
        },
        error: err => {
          this.creationSuccess = false;
          this.errorMessage = err.error?.message || 'Error creating salary template.';
        }
      });
  }
}
