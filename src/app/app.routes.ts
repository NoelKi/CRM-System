import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { ChangePasswordComponent } from './main/pages/change-password/change-password.component';
import { CustomerDetailComponent } from './main/pages/customer-detail/customer-detail.component';
import { CustomerComponent } from './main/pages/customer/customer.component';
import { DashboardComponent } from './main/pages/dashboard/dashboard.component';
import { LoginComponent } from './main/pages/login/login.component';
import { PlaygroundComponent } from './main/pages/playground/playground/playground.component';
import { SettingsComponent } from './main/pages/settings/settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      { path: 'settings', component: SettingsComponent },
      {
        path: 'customer',
        component: CustomerComponent
      },
      { path: 'customer/:id', component: CustomerDetailComponent },
      { path: 'playground', component: PlaygroundComponent },
      { path: 'change-password', component: ChangePasswordComponent }
    ]
  }
];
