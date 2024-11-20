import { Routes } from '@angular/router';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { isUserAuthenticated } from './guard/auth.guard';
import { LoginComponent } from './login/login.component';
import { PlaygroundComponent } from './playground/playground/playground.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [isUserAuthenticated] },
  { path: 'customer', component: CustomerComponent, canActivate: [isUserAuthenticated] },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'customer/:id', component: CustomerDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'playground', component: PlaygroundComponent }
];
