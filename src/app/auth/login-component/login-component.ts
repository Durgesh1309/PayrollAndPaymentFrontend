import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RecaptchaModule, RecaptchaErrorParameters } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RecaptchaModule,RouterLink],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.css']
})
export class LoginComponent {
  loginData = {
    usernameOrEmail: '',
    password: '',
    captchaToken: ''
  };
  
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
  this.errorMessage = null;
  if (this.loginData.usernameOrEmail && this.loginData.password && this.loginData.captchaToken) {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        const roles = response.roles; // array of strings like 'ROLE_EMPLOYEE', etc

        if (roles.includes('ROLE_BANK_ADMIN')) {
          this.router.navigate(['/admin-dashboard']);
        } else if (roles.includes('ROLE_EMPLOYEE')) {
          this.router.navigate(['/employee-dashboard']);
        } else if (roles.includes('ROLE_ORGANIZATION_ADMIN')) {
          this.router.navigate(['/organization-dashboard']);
        } else {
          this.router.navigate(['']); // fallback
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  } else {
    this.errorMessage = 'Please fill all fields and complete the captcha.';
  }
}



onCaptchaResolved(token: string | null) {
  if (token) {
    this.loginData.captchaToken = token;
  } else {
    this.loginData.captchaToken = '';
  }
}


  onCaptchaError(errorDetails: RecaptchaErrorParameters) {
    this.errorMessage = "Captcha error. Please try again.";
    this.loginData.captchaToken = '';
  }
}
