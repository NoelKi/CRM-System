import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ResponsiveService } from '../../../core/services/responsive.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../auth/auth.service';
import { menuItems } from '../../menuItem';

@Component({
  selector: 'app-shell',
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
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
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
