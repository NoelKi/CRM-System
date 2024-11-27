import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { menuItems } from '../menuItem';
import { AuthService } from '../services/auth.service';
import { ResponsiveService } from '../services/responsive.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-main-component',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './main-component.component.html',
  styleUrl: './main-component.component.scss'
})
export class MainComponentComponent {
  themeService = inject(ThemeService);
  responsiveService = inject(ResponsiveService);
  private _authService = inject(AuthService);
  isLoggedIn = this._authService.isLoggedIn;
  title = 'CRM-System';
  menuItems = signal(menuItems);

  navToggle = computed(() => {
    if (this.responsiveService.largeWidth()) {
      return true;
    } else return false;
  });

  themeSelectorMode = computed(() => {
    if (this.responsiveService.largeWidth()) {
      return 'side';
    } else return 'over';
  });

  onLogout(): void {
    this._authService.logout();
  }
}
