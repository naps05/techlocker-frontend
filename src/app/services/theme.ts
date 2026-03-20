import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(true);

  toggle() {
    this.isDark.update(v => !v);
    if (this.isDark()) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }

  init() {
    document.body.classList.remove('light-mode');
  }
}