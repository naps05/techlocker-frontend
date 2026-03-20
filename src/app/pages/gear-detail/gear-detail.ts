import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GearService, Gear } from '../../services/gear';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-gear-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar />
    
    <div class="video-bg">
  @if (theme.isDark()) {
    <video autoplay muted loop playsinline>
      <source src="bg-video.mp4" type="video/mp4" />
    </video>
  } @else {
    <video autoplay muted loop playsinline class="light-video">
      <source src="bg-video4.mp4" type="video/mp4" />
    </video>
  }
</div>

    <main class="main content">
      <a routerLink="/dashboard" class="back-link">← Back to vault</a>

      @if (loading()) {
        <div class="state-msg">Loading gear details...</div>
      } @else if (gear()) {
        <div class="detail-card">
          <div class="photo-section">
            @if (gear()!.photoUrl) {
              <img [src]="gear()!.photoUrl" [alt]="gear()!.name" class="gear-photo" />
            } @else {
              <div class="no-photo">🎮</div>
            }
          </div>

          <div class="info-section">
            <div class="gear-header">
              <h2>{{ gear()!.name }}</h2>
              <div class="actions">
                <a [routerLink]="['/gear', gear()!._id, 'edit']" class="btn-edit">Edit</a>
                <button class="btn-delete" (click)="deleteGear()">Delete</button>
              </div>
            </div>

            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Model</span>
                <span class="detail-value">{{ gear()!.model }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Serial Number</span>
                <span class="detail-value serial">{{ gear()!.serialNumber }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Owner</span>
                <span class="detail-value owner">👤 {{ gear()!.ownerName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date Added</span>
                <span class="detail-value">{{ gear()!.createdAt | date:'MMMM d, y' }}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </main>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    :host { display: block; background: #0a0a0f; min-height: 100vh; font-family: 'DM Sans', sans-serif; }

    .main { max-width: 900px; margin: 0 auto; padding: 40px 32px; }

    .back-link {
      display: inline-block;
      color: rgba(255,255,255,0.35);
      text-decoration: none;
      font-size: 14px;
      margin-bottom: 28px;
      transition: color 0.2s;
    }

    .back-link:hover { color: #818cf8; }
    .state-msg { text-align: center; color: rgba(255,255,255,0.3); padding: 80px 0; }

    .detail-card {
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 20px;
      overflow: hidden;
      display: grid;
      grid-template-columns: 380px 1fr;
    }

    .photo-section {
      background: rgba(255,255,255,0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 360px;
    }

    .gear-photo { width: 100%; height: 100%; object-fit: cover; }
    .no-photo { font-size: 72px; opacity: 0.2; }

    .info-section { padding: 40px; }

    .gear-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 36px;
    }

    h2 {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 26px;
      color: #fff;
      margin: 0;
    }

    .actions { display: flex; gap: 8px; }

    .btn-edit {
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.6);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 8px 16px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-edit:hover { background: rgba(255,255,255,0.1); color: #fff; }

    .btn-delete {
      background: rgba(248,113,113,0.08);
      color: #f87171;
      border: 1px solid rgba(248,113,113,0.15);
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'DM Sans', sans-serif;
    }

    .btn-delete:hover { background: rgba(248,113,113,0.18); }

    .detail-grid { display: flex; flex-direction: column; gap: 24px; }
    .detail-item { display: flex; flex-direction: column; gap: 6px; }

    .detail-label {
      font-size: 11px;
      font-weight: 500;
      color: rgba(255,255,255,0.3);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .detail-value { font-size: 16px; color: #fff; }

    .serial {
      font-family: 'Courier New', monospace;
      color: #818cf8;
      font-size: 14px;
      background: rgba(99,102,241,0.08);
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
    }

    .owner { color: #a5b4fc; }

    @media (max-width: 700px) {
      .detail-card { grid-template-columns: 1fr; }
      .photo-section { min-height: 220px; }
    }

    /* VIDEO BACKGROUND */
.video-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.video-bg video { 
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.25);
}

/* Light mode video — less darkening so it's visible */
.video-bg video.light-video { 
  filter: brightness(0.6); 
}

/* Make content above video */
.content {
  position: relative;
  z-index: 1;
}

  `],
})
export class GearDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gearService = inject(GearService);
    theme = inject(ThemeService);

  gear = signal<Gear | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.gearService.getById(id).subscribe({
      next: (data) => { this.gear.set(data); this.loading.set(false); },
      error: () => { this.loading.set(false); this.router.navigate(['/dashboard']); },
    });
  }

  deleteGear() {
    if (!confirm('Remove this gear from the vault?')) return;
    this.gearService.delete(this.gear()!._id!).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}