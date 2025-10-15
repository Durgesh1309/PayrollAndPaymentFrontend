import { CommonModule, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminOrganizations } from '../admin-organizations/admin-organizations';
import { AdminPendingDocumentsComponent } from '../admin-pending-documents-component/admin-pending-documents-component';

@Component({
  selector: 'app-admin-dash-board-component',
  imports: [CommonModule,FormsModule,AdminOrganizations,AdminPendingDocumentsComponent],
  templateUrl: './admin-dash-board-component.html',
  styleUrl: './admin-dash-board-component.css'
})
export class AdminDashBoardComponent {
adminName: string = '';
  stats = { organizations: 0, pendingDocs: 0, approvedToday: 0 };
  currentSection: string = 'dashboard';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProfile();
    this.fetchDashboardStats();
  }

  fetchProfile() {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>('http://localhost:8080/api/auth/user', { headers }).subscribe(user => {
      this.adminName = user.username || '';
    });
  }

 fetchDashboardStats() {
  const token = localStorage.getItem('jwtToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.get<any[]>('http://localhost:8080/api/bank-admin/organizations/pending', { headers })
    .subscribe(data => {
      this.stats.organizations = data.length; // pending organizations count
      // You can add more logic here for other stats if required
      this.stats.pendingDocs = 0;  // Set to 0 or fetch via another endpoint if exists
      this.stats.approvedToday = 0; // Set to 0 or implement if required
    });
}


  showSection(section: string) {
    this.currentSection = section;
  }
}
