import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  themeModeIcon: 'light_mode' | 'dark_mode' = 'dark_mode';

  constructor() {
    if (this.isDarkMode) {
      this.toggleMode();
    }
  }

  toggleMode() {
    document.body.classList.toggle('dark-theme');
    this.isDarkMode = !this.isDarkMode;
    this.themeModeIcon = this.isDarkMode ? 'light_mode' : 'dark_mode';
  }
}
