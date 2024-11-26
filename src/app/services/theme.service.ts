import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themeModeIcon: TthemeMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark_mode'
    : 'light_mode';

  constructor() {
    if (this.themeModeIcon === 'dark_mode') {
      this.toggleMode(this.themeModeIcon);
    }
  }

  toggleMode(themeModeIcon: TthemeMode): void {
    document.body.classList.toggle('dark-theme');
    themeModeIcon === 'light_mode' ? 'dark_mode' : 'light_mode';
  }
}

type TthemeMode = 'light_mode' | 'dark_mode';
