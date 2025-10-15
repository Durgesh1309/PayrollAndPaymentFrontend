import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-assign-salary-template-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-salary-template-component.html',
  styleUrls: ['./assign-salary-template-component.css']
})
export class AssignSalaryTemplateComponent implements OnInit {
  @Input() employeeId!: number;
  @Output() assignmentComplete = new EventEmitter<void>();
  templates: any[] = [];
  selectedTemplateId?: number;
  loading = false;
  message = '';
  orgId: number = Number(localStorage.getItem('organizationId'));

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('AssignSalaryTemplateComponent loaded for employee id:', this.employeeId);
    this.fetchTemplates();
  }

  fetchTemplates(): void {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`http://localhost:8080/api/organization/${this.orgId}/salary-templates`, { headers })
      .subscribe({
        next: data => { this.templates = data; },
        error: err => { this.message = 'Unable to load templates.'; }
      });
  }

  assignTemplate(): void {
    console.log('Assign button clicked', this.employeeId, this.selectedTemplateId);
    if (!this.selectedTemplateId || !this.employeeId) {
      this.message = 'Select a template first.';
      return;
    }
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.loading = true;

    this.http.post(
      `http://localhost:8080/api/employee/assign-template/${this.employeeId}/${this.selectedTemplateId}`,
      {},
      { headers }
    ).subscribe({
      next: _ => {
        this.message = 'Template assigned!';
        this.loading = false;
        this.assignmentComplete.emit();
      },
      error: err => {
        this.message = 'Assignment failed: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }
}
