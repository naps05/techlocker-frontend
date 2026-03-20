import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GearService, Gear } from '../../services/gear';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  template: `
    <div class="page-wrapper" [class.light-mode]="!theme.isDark()">

      <!-- Background Video -->
@if (theme.isDark()) {
  <video autoplay muted loop playsinline class="bg-video">
    <source src="/bg-video.mp4" type="video/mp4">
  </video>
} @else {
  <video autoplay muted loop playsinline class="bg-video">
    <source src="/bg-video4.mp4" type="video/mp4">
  </video>
}

      <div class="video-overlay"></div>

      <app-navbar />

      <main class="main">

        <div class="page-header">
          <div class="header-left">
            <p class="header-label">// GEAR INVENTORY //</p>
            <h2>THE VAULT</h2>
            <p class="subtitle">
              <span class="count">{{ gears().length }}</span>
              ITEM{{ gears().length !== 1 ? 'S' : '' }} SECURED
            </p>
          </div>
          <a routerLink="/gear/add" class="add-btn">
            <span>+ ADD GEAR</span>
            <span class="btn-arrow">▶</span>
          </a>
        </div>

        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="SEARCH BY GEAR NAME OR OWNER..."
            class="search-input"
          />
        </div>

        @if (loading()) {
          <div class="state-msg">
            <div class="loading-dots">
              <span></span><span></span><span></span>
            </div>
            <p>LOADING VAULT...</p>
          </div>
        } @else if (filteredGears().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📦</div>
            <p class="empty-title">VAULT IS EMPTY</p>
            <p class="empty-sub">No gear found. Start securing your items.</p>
            <a routerLink="/gear/add" class="add-btn" style="display:inline-flex;margin-top:20px">
              <span>+ ADD FIRST GEAR</span>
              <span class="btn-arrow">▶</span>
            </a>
          </div>
        } @else {
          <div class="gear-grid">
            @for (gear of filteredGears(); track gear._id) {
              <div class="gear-card">
                <div class="card-top-accent"></div>
                <div class="gear-photo">
                  @if (gear.photoUrl) {
                    <img [src]="gear.photoUrl" [alt]="gear.name" />
                  } @else {
                    <div class="no-photo">
                      <span>🎮</span>
                      <p>NO IMAGE</p>
                    </div>
                  }
                  <div class="photo-overlay-tag">SECURED</div>
                </div>

                <div class="gear-info">
                  <h3 class="gear-name">{{ gear.name }}</h3>
                  <p class="gear-model">{{ gear.model }}</p>
                  <div class="gear-meta">
                    <span class="owner-tag">👤 {{ gear.ownerName }}</span>
                    <span class="date-tag">{{ gear.createdAt | date:'MMM d, y' }}</span>
                  </div>
                </div>

                <div class="gear-actions">
                  <a [routerLink]="['/gear', gear._id]" class="btn-view">VIEW</a>
                  <a [routerLink]="['/gear', gear._id, 'edit']" class="btn-edit">EDIT</a>
                  <button class="btn-delete" (click)="deleteGear(gear._id!)">DEL</button>
                </div>

                <div class="card-corner tl"></div>
                <div class="card-corner tr"></div>
                <div class="card-corner bl"></div>
                <div class="card-corner br"></div>
              </div>
            }
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes dotPulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }

    :host { display: block; }

    .page-wrapper {
      min-height: 100vh;
      background: #080008;
      font-family: 'Rajdhani', sans-serif;
      position: relative;
      overflow-x: hidden;
    }

    .bg-video {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
      opacity: 0.18;
      pointer-events: none;
    }

    .video-overlay {
      position: fixed;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(8,0,8,0.88) 0%,
        rgba(10,0,0,0.78) 50%,
        rgba(8,0,8,0.92) 100%
      );
      z-index: 0;
      pointer-events: none;
    }

    .page-wrapper::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 1;
    }

    .light-mode .bg-video { opacity: 0.06; }
    .light-mode .video-overlay {
  background: linear-gradient(
    to bottom,
    rgba(245,240,240,0.65) 0%,   /* was 0.92 */
    rgba(240,240,248,0.60) 50%,  /* was 0.88 */
    rgba(245,240,240,0.70) 100%  /* was 0.95 */
  );
    }
    .light-mode .main { color: #111; }
    .light-mode h2 { color: #111; text-shadow: none; }
    .light-mode .header-label { color: rgba(0, 0, 0, 0.6); }
    .light-mode .subtitle { color: rgba(0,0,0,0.4); }
    .light-mode .search-input { background: rgba(0,0,0,0.04); border-color: rgba(220,38,38,0.2); color: #111; }
    .light-mode .search-input::placeholder { color: rgb(141, 6, 6); }
    .light-mode .gear-card { background: rgba(255,255,255,0.92); border-color: rgba(220,38,38,0.2); }
    .light-mode .gear-name { color: #111; }
    .light-mode .gear-model { color: rgba(0,0,0,0.45); }
    .light-mode .date-tag { color: rgba(0,0,0,0.3); }
    .light-mode .btn-edit { background: rgba(0,0,0,0.05); color: rgba(0,0,0,0.6); border-color: rgba(0,0,0,0.1); }
    .light-mode .state-msg p { color: rgba(0,0,0,0.3); }
    .light-mode .empty-title { color: rgba(0,0,0,0.4); }
    .light-mode .empty-sub { color: rgba(0,0,0,0.3); }
    .light-mode .bg-video { opacity: 0.45;   /* was 0.06 */}
    

    .main {
      max-width: 1280px;
      margin: 0 auto;
      padding: 40px 32px;
      position: relative;
      z-index: 2;
    }

    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 36px;
    }

    .header-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      color: rgba(220,38,38,0.6);
      letter-spacing: 3px;
      margin: 0 0 8px;
    }

    h2 {
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      font-size: 36px;
      color: #fff;
      margin: 0 0 6px;
      letter-spacing: 4px;
      text-shadow: 0 0 30px rgba(220,38,38,0.3);
    }

    .subtitle {
      font-family: 'Share Tech Mono', monospace;
      color: rgba(255,255,255,0.3);
      font-size: 12px;
      margin: 0;
      letter-spacing: 2px;
    }

    .count { color: #dc2626; font-size: 14px; font-weight: bold; }

    .add-btn {
      background: linear-gradient(135deg, #dc2626, #7f1d1d);
      color: #fff;
      text-decoration: none;
      border: 1px solid rgba(220,38,38,0.5);
      border-radius: 2px;
      padding: 12px 24px;
      font-family: 'Orbitron', monospace;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;
    }

    .add-btn::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
      transition: left 0.4s;
    }

    .add-btn:hover::before { left: 100%; }
    .add-btn:hover { box-shadow: 0 0 20px rgba(220,38,38,0.4); transform: translateY(-1px); }
    .btn-arrow { font-size: 10px; opacity: 0.7; }

    .search-wrap {
      position: relative;
      margin-bottom: 36px;
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      opacity: 0.4;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      background: rgba(220,38,38,0.03);
      border: 1px solid rgba(220,38,38,0.15);
      border-radius: 2px;
      padding: 14px 20px 14px 44px;
      color: #fff;
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px;
      box-sizing: border-box;
      transition: all 0.2s;
      letter-spacing: 1px;
    }

    .search-input:focus {
      outline: none;
      border-color: rgba(220,38,38,0.5);
      box-shadow: 0 0 16px rgba(220,38,38,0.08);
    }

    .search-input::placeholder { color: rgba(255,255,255,0.15); letter-spacing: 2px; }

    .state-msg {
      text-align: center;
      padding: 80px 0;
    }

    .loading-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .loading-dots span {
      width: 8px; height: 8px;
      background: #dc2626;
      border-radius: 50%;
      animation: dotPulse 1.2s ease-in-out infinite;
    }

    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

    .state-msg p {
      font-family: 'Share Tech Mono', monospace;
      color: rgba(255,255,255,0.2);
      font-size: 12px;
      letter-spacing: 3px;
    }

    .empty-state { text-align: center; padding: 80px 0; }
    .empty-icon { font-size: 56px; margin-bottom: 16px; opacity: 0.4; }

    .empty-title {
      font-family: 'Orbitron', monospace;
      font-size: 18px;
      color: rgba(255,255,255,0.4);
      letter-spacing: 4px;
      margin: 0 0 8px;
    }

    .empty-sub {
      font-family: 'Share Tech Mono', monospace;
      color: rgba(255,255,255,0.2);
      font-size: 12px;
      letter-spacing: 1px;
    }

    .gear-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .gear-card {
      position: relative;
      background: rgba(8,8,12,0.85);
      border: 1px solid rgba(220,38,38,0.15);
      border-radius: 4px;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
      backdrop-filter: blur(10px);
    }

    .gear-card:hover {
      transform: translateY(-4px);
      border-color: rgba(220,38,38,0.4);
      box-shadow: 0 8px 32px rgba(220,38,38,0.12);
    }

    .card-top-accent {
      height: 2px;
      background: linear-gradient(90deg, transparent, #dc2626, transparent);
      opacity: 0.6;
    }

    .card-corner {
      position: absolute;
      width: 8px; height: 8px;
      border-color: rgba(220,38,38,0.5);
      border-style: solid;
    }

    .tl { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
    .tr { top: -1px; right: -1px; border-width: 1px 1px 0 0; }
    .bl { bottom: -1px; left: -1px; border-width: 0 0 1px 1px; }
    .br { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }

    .gear-photo {
      height: 180px;
      background: rgba(255,255,255,0.02);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    .gear-photo img { width: 100%; height: 100%; object-fit: cover; }

    .no-photo { text-align: center; opacity: 0.2; }
    .no-photo span { font-size: 40px; display: block; margin-bottom: 6px; }
    .no-photo p {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      letter-spacing: 2px;
      color: #fff;
    }

    .photo-overlay-tag {
      position: absolute;
      top: 10px; right: 10px;
      background: rgba(220,38,38,0.8);
      color: #fff;
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px;
      letter-spacing: 2px;
      padding: 3px 8px;
      border-radius: 2px;
    }

    .gear-info { padding: 16px 20px 0; }

    .gear-name {
      font-family: 'Orbitron', monospace;
      font-weight: 700;
      font-size: 14px;
      color: #fff;
      margin: 0 0 4px;
      letter-spacing: 1px;
    }

    .gear-model {
      font-family: 'Share Tech Mono', monospace;
      color: rgba(255,255,255,0.35);
      font-size: 12px;
      margin: 0 0 12px;
      letter-spacing: 1px;
    }

    .gear-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
    }

    .owner-tag {
      background: rgba(220,38,38,0.1);
      color: #f87171;
      border: 1px solid rgba(220,38,38,0.2);
      border-radius: 2px;
      padding: 3px 8px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      letter-spacing: 1px;
    }

    .date-tag {
      font-family: 'Share Tech Mono', monospace;
      color: rgba(255,255,255,0.2);
      font-size: 10px;
      letter-spacing: 1px;
    }

    .gear-actions {
      display: flex;
      gap: 6px;
      padding: 12px 20px 16px;
      border-top: 1px solid rgba(220,38,38,0.08);
    }

    .btn-view, .btn-edit {
      flex: 1;
      text-align: center;
      text-decoration: none;
      border-radius: 2px;
      padding: 8px 0;
      font-family: 'Orbitron', monospace;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      transition: all 0.2s;
    }

    .btn-view {
      background: rgba(220,38,38,0.1);
      color: #f87171;
      border: 1px solid rgba(220,38,38,0.25);
    }

    .btn-view:hover { background: rgba(220,38,38,0.2); box-shadow: 0 0 10px rgba(220,38,38,0.2); }

    .btn-edit {
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.5);
      border: 1px solid rgba(255,255,255,0.08);
    }

    .btn-edit:hover { background: rgba(255,255,255,0.08); color: #fff; }

    .btn-delete {
      flex: 1;
      background: rgba(220,38,38,0.06);
      color: #f87171;
      border: 1px solid rgba(220,38,38,0.15);
      border-radius: 2px;
      padding: 8px 0;
      font-family: 'Orbitron', monospace;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-delete:hover { background: rgba(220,38,38,0.15); box-shadow: 0 0 10px rgba(220,38,38,0.15); }
  `],
})
export class DashboardComponent implements OnInit {
  private gearService = inject(GearService);
  theme = inject(ThemeService);

  gears = signal<Gear[]>([]);
  loading = signal(true);
  searchQuery = '';

  ngOnInit() {
    this.gearService.getAll().subscribe({
      next: (data) => { this.gears.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  filteredGears(): Gear[] {
    if (!this.searchQuery.trim()) return this.gears();
    const q = this.searchQuery.toLowerCase();
    return this.gears().filter(g =>
      g.name.toLowerCase().includes(q) || g.ownerName.toLowerCase().includes(q)
    );
  }

  deleteGear(id: string) {
    if (!confirm('Remove this gear from the vault?')) return;
    this.gearService.delete(id).subscribe(() => {
      this.gears.update(list => list.filter(g => g._id !== id));
    });
  }
}