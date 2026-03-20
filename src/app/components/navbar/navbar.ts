import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar" [class.light]="!theme.isDark()">
      <div class="nav-brand">
        <span class="lock">🔒</span>
        <span class="brand-name">TechLocker</span>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/gear/add" routerLinkActive="active">+ Add Gear</a>
        <a routerLink="/settings" routerLinkActive="active">Settings</a>
        <button class="theme-btn" (click)="theme.toggle()">
          {{ theme.isDark() ? '☀️' : '🌙' }}
        </button>
        <button class="logout-btn" (click)="auth.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&display=swap');

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      height: 64px;
      background: rgba(10, 10, 15, 0.7); /* more transparent */
      border-bottom: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
      font-family: 'DM Sans', sans-serif;
      transition: background 0.3s, border-color 0.3s;
    }

    .navbar.light {
      background: rgba(133, 26, 26, 0.8); /* more transparent light mode */
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    .navbar.light .brand-name { color: #ffffff; }
    .navbar.light a { color: rgba(255, 255, 255, 0.6); }
    .navbar.light a:hover { color: #ffffff; background: rgba(0,0,0,0.08); }
    .navbar.light a.active { color: #ffffff; background: rgba(255, 255, 255, 0.12); }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .lock { font-size: 20px; filter: drop-shadow(0 0 8px rgba(220,38,38,0.6)); }

    .brand-name {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 18px;
      color: #fff;
      letter-spacing: -0.3px;
      transition: color 0.3s;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    a {
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 8px;
      transition: all 0.2s;
    }

    a:hover { color: #fff; background: rgba(255,255,255,0.1); }
    a.active { color: #f87171; background: rgba(220,38,38,0.12); }

    .theme-btn {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .theme-btn:hover { background: rgba(255,255,255,0.15); }

    .logout-btn {
      background: rgba(220, 38, 38, 0.12);
      color: #f87171;
      border: 1px solid rgba(220, 38, 38, 0.25);
      border-radius: 8px;
      padding: 6px 14px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      margin-left: 8px;
    }

    .logout-btn:hover { background: rgba(220, 38, 38, 0.2); }
  `],
})
export class NavbarComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
}
