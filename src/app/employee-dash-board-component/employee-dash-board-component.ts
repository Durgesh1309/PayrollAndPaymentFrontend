import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../Services/employee-service';
import { CommonModule, DatePipe, DecimalPipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { KycDocumentUploadComponent } from '../kyc-document-upload-component/kyc-document-upload-component';
import { ChangePasswordComponent } from '../change-password-component/change-password-component';


@Component({
  selector: 'app-employee-dash-board-component',
  templateUrl: './employee-dash-board-component.html',
  styleUrls: ['./employee-dash-board-component.css'],
  standalone: true,
  imports: [CommonModule, DatePipe, SlicePipe, TitleCasePipe, DecimalPipe,
     KycDocumentUploadComponent,ChangePasswordComponent],
})
export class EmployeeDashBoardComponent implements OnInit {

  employee: any = {};
  showKycUpload = false;
  showBankAccountUpdate = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.refreshEmployeeData();
  }

  refreshEmployeeData() {
    this.employeeService.getEmployeeProfile().subscribe({
      next: data => this.employee = data,
      error: err => console.error('Failed to fetch employee profile', err)
    });
  }

  openKycUpdate() {
    alert('openKycUpdate called!'); // debug alert
    console.log('openKycUpdate', this.employee);
    if (this.employee?.id && this.employee?.organizationId) {
      this.showKycUpload = true;
      console.log('showKycUpload set TRUE');
    } else {
      console.error('Employee or organization ID missing', this.employee);
    }
  }

  public testClick(): void {
    alert('testClick on button WORKS!');
    console.log('testClick called!');
  }

  openBankAccountUpdate() {
    this.showBankAccountUpdate = true;
  }

  onModalClose() {
    this.showKycUpload = false;
    this.showBankAccountUpdate = false;
    this.refreshEmployeeData();
  }
}
