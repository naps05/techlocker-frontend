import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GearService } from '../../services/gear';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-gear-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent],
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
      <h2>Edit Gear</h2>
      <p class="subtitle">Update the details of your gear</p>

      <div class="form-card">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">

          <div class="photo-upload-area" (click)="fileInput.click()">
            @if (photoPreview()) {
              <img [src]="photoPreview()" class="photo-preview" alt="Gear photo" />
              <div class="photo-overlay">Click to change</div>
            } @else {
              <div class="upload-placeholder">
                <span class="upload-icon">📸</span>
                <p>Click to upload new photo</p>
                <span class="upload-hint">Current photo kept if none selected</span>
              </div>
            }
          </div>
          <input #fileInput type="file" accept="image/*" (change)="onFileChange($event)" style="display:none" />

          <div class="fields-grid">
            <div class="field">
              <label>Gear Name *</label>
              <input type="text" formControlName="name" />
              @if (form.get('name')?.invalid && form.get('name')?.touched) {
                <span class="error">Gear name is required</span>
              }
            </div>
            <div class="field">
              <label>Model *</label>
              <input type="text" formControlName="model" />
              @if (form.get('model')?.invalid && form.get('model')?.touched) {
                <span class="error">Model is required</span>
              }
            </div>
            <div class="field">
              <label>Serial Number *</label>
              <input type="text" formControlName="serialNumber" />
              @if (form.get('serialNumber')?.invalid && form.get('serialNumber')?.touched) {
                <span class="error">Serial number is required</span>
              }
            </div>
            <div class="field">
              <label>Owner Name *</label>
              <input type="text" formControlName="ownerName" />
              @if (form.get('ownerName')?.invalid && form.get('ownerName')?.touched) {
                <span class="error">Owner name is required</span>
              }
            </div>
          </div>

          @if (errorMsg()) {
            <div class="alert-error">{{ errorMsg() }}</div>
          }

          <div class="form-actions">
            <a routerLink="/dashboard" class="btn-cancel">Cancel</a>
            <button type="submit" [disabled]="loading()">
              @if (loading()) { Saving... } @else { Save Changes }
            </button>
          </div>
        </form>
      </div>
    </main>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    :host { display: block; background: #0a0a0f; min-height: 100vh; font-family: 'DM Sans', sans-serif; position: relative; }

    .video-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
    .video-bg video { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.25); }
    .video-bg video.light-video { filter: brightness(0.6); }
    .content { position: relative; z-index: 1; }

    .main { max-width: 760px; margin: 0 auto; padding: 40px 32px; }

    .back-link { display: inline-block; color: rgba(255,255,255,0.35); text-decoration: none; font-size: 14px; margin-bottom: 20px; transition: color 0.2s; }
    .back-link:hover { color: #f87171; }

    h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: #fff; margin: 0 0 6px; }
    .subtitle { color: rgba(255,255,255,0.35); font-size: 14px; margin: 0 0 32px; }

    .form-card {
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(220,38,38,0.15);
      border-radius: 20px;
      padding: 36px;
    }

    .photo-upload-area {
      position: relative;
      height: 250px;
      width: 250px;
      margin: 0 auto 28px;
      border: 2px dashed rgba(220,38,38,0.2);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      transition: border-color 0.2s;
    }

    .photo-upload-area:hover { border-color: rgba(220,38,38,0.5); }
    .photo-preview { width: 100%; height: 100%; object-fit: contain; background: #0a0a0f; }

    .photo-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .photo-upload-area:hover .photo-overlay { opacity: 1; }
    .upload-placeholder { text-align: center; color: rgba(255,255,255,0.3); }
    .upload-icon { font-size: 32px; display: block; margin-bottom: 8px; }
    .upload-placeholder p { margin: 0 0 4px; font-size: 14px; }
    .upload-hint { font-size: 12px; }

    .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .field { display: flex; flex-direction: column; gap: 8px; }
    label { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; }

    input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 16px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 15px; transition: border-color 0.2s; }
    input:focus { outline: none; border-color: rgba(220,38,38,0.6); background: rgba(220,38,38,0.04); }

    .error { color: #f87171; font-size: 12px; }
    .alert-error { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.3); color: #f87171; border-radius: 10px; padding: 10px 14px; font-size: 14px; margin-bottom: 20px; }

    .form-actions { display: flex; gap: 12px; justify-content: flex-end; }
    .btn-cancel { padding: 12px 24px; border-radius: 10px; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.08); text-decoration: none; font-size: 14px; font-weight: 500; transition: all 0.2s; }
    .btn-cancel:hover { background: rgba(255,255,255,0.09); color: #fff; }

    button[type=submit] {
      background: #dc2626;
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 12px 28px;
      font-family: 'Syne', sans-serif;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }
    button[type=submit]:hover:not(:disabled) { background: #b91c1c; transform: translateY(-1px); }
    button[type=submit]:disabled { opacity: 0.5; cursor: not-allowed; }

    @media (max-width: 600px) { .fields-grid { grid-template-columns: 1fr; } }
  `],
})
export class GearEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gearService = inject(GearService);
  theme = inject(ThemeService);

  gearId = '';
  form = this.fb.group({
    name: ['', Validators.required],
    model: ['', Validators.required],
    serialNumber: ['', Validators.required],
    ownerName: ['', Validators.required],
  });

  photoPreview = signal<string | null>(null);
  selectedFile: File | null = null;
  loading = signal(false);
  errorMsg = signal('');

  ngOnInit() {
    this.gearId = this.route.snapshot.paramMap.get('id')!;
    this.gearService.getById(this.gearId).subscribe(gear => {
      this.form.patchValue(gear);
      if (gear.photoUrl) this.photoPreview.set(gear.photoUrl);
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.photoPreview.set(e.target?.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');

    const formData = new FormData();
    const v = this.form.value;
    formData.append('name', v.name!);
    formData.append('model', v.model!);
    formData.append('serialNumber', v.serialNumber!);
    formData.append('ownerName', v.ownerName!);
    if (this.selectedFile) formData.append('photo', this.selectedFile);

    this.gearService.update(this.gearId, formData).subscribe({
      next: () => this.router.navigate(['/gear', this.gearId]),
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Failed to update gear.');
        this.loading.set(false);
      },
    });
  }
}