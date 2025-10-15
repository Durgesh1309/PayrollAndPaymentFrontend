import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './register-component.html',
  styleUrls: ['./register-component.css']
})
export class RegisterComponent {

  registrationData = {
    name: '',
    contactNumber: '',
    address: '',
    adminUsername: '',
    adminEmail: '',
    adminPassword: ''
  };

  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: NgForm) {
    this.errorMessage = null;

    if (!form.valid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.http.post('http://localhost:8080/api/auth/register', this.registrationData).subscribe({
      next: () => {
        // On successful registration, navigate to login page
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }
}
