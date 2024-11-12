import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlaygroundComponent } from './playground/playground/playground.component';
import { SettingsComponent } from './settings/settings.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'user', component: UserComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'playground', component: PlaygroundComponent },
  { path: 'settings', component: SettingsComponent }
];
