import { Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MainComponentComponent } from './main-component/main-component.component';
import { PlaygroundComponent } from './playground/playground/playground.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainComponentComponent,
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
  },
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,

  //   outlet: 'pages'
  // },
  // { path: 'settings', component: SettingsComponent, outlet: 'pages' },
  // {
  //   path: 'customer',
  //   component: CustomerComponent,
  //   // canActivate: [isUserAuthenticated],
  //   outlet: 'pages'
  // },
  // { path: 'customer/:id', component: CustomerDetailComponent, outlet: 'pages' },
  // { path: 'playground', component: PlaygroundComponent, outlet: 'pages' },
  // { path: 'change-password', component: ChangePasswordComponent, outlet: 'pages' },
  // { path: '', redirectTo: 'dashboard', pathMatch: 'full', outlet: 'pages' },
  { path: '', redirectTo: 'main', pathMatch: 'full' }
  // { path: '**', component: NoComponentFoundComponent},
];
