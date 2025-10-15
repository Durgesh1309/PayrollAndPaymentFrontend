import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login-component/login-component';
import { OrganizationDashBoardComponent } from './organization-dash-board-component/organization-dash-board-component';
import { EmployeeDashBoardComponent } from './employee-dash-board-component/employee-dash-board-component';
import { AdminDashBoardComponent } from './admin-dash-board-component/admin-dash-board-component';
import { HomeDashBoardComponent } from './home-dash-board-component/home-dash-board-component';
import { RegisterComponent } from './register-component/register-component';
import { AuthGuard } from './guards/auth-guard';


export const routes: Routes = [
  { path: '', component: HomeDashBoardComponent },
  { path: 'home', component: HomeDashBoardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin-dashboard', component: AdminDashBoardComponent, canActivate: [AuthGuard] },
  { path: 'organization-dashboard', component: OrganizationDashBoardComponent, canActivate: [AuthGuard] },
  { path: 'employee-dashboard', component: EmployeeDashBoardComponent, canActivate: [AuthGuard] }
];

