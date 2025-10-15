import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-dash-board-component',
  imports: [],
  templateUrl: './home-dash-board-component.html',
  styleUrl: './home-dash-board-component.css'
})
export class HomeDashBoardComponent {

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignup() {
    this.router.navigate(['/register']);
  }
}
