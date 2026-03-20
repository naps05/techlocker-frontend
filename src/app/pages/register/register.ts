import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="glow-red"></div>
      <div class="glow-blue"></div>

      <video autoplay muted loop playsinline class="bg-video">
        <source src="bg-video3.mp4" type="video/mp4" />
      </video>

      <div class="auth-card">
        <div class="card-accent"></div>

        <div class="brand">
          <div class="lock-wrap">
            <span class="lock-icon">🔒</span>
            <div class="lock-ring"></div>
          </div>
          <h1>TECH<span class="red">LOCKER</span></h1>
          <p class="tagline">// INITIALIZE VAULT //</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label><span class="lb">[</span> USERNAME/TEAMNAME <span class="lb">]</span></label>
            <div class="input-wrap">
              <span class="input-icon">👾</span>
              <input type="text" formControlName="username" placeholder="e.g. TeamAlpha" />
            </div>
            @if (form.get('username')?.invalid && form.get('username')?.touched) {
              <span class="error">⚠ Username required</span>
            }
          </div>

          <div class="field">
            <label><span class="lb">[</span> EMAIL <span class="lb">]</span></label>
            <div class="input-wrap">
              <span class="input-icon">✉</span>
              <input type="email" formControlName="email" placeholder="operator@vault.gg" />
            </div>
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <span class="error">⚠ Valid email required</span>
            }
          </div>

          <div class="field">
            <label><span class="lb">[</span> PASSWORD <span class="lb">]</span></label>
            <div class="input-wrap">
              <span class="input-icon">🔑</span>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Min. 6 characters"
              />
              <button type="button" class="toggle-pw" (click)="showPassword.set(!showPassword())">
                @if (showPassword()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                }
              </button>
            </div>
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
              <span class="error">⚠ Min. 6 characters required</span>
            }
          </div>

          @if (errorMsg()) {
            <div class="alert-error">⚠ {{ errorMsg() }}</div>
          }

          <button type="submit" [disabled]="loading()" class="submit-btn">
            <span class="btn-text">
              @if (loading()) { INITIALIZING... } @else { CREATE VAULT }
            </span>
            <span class="btn-arrow">▶</span>
          </button>
        </form>

        <p class="switch-link">
          HAVE A VAULT? <a routerLink="/login">ACCESS NOW</a>
        </p>

        <div class="card-corner tl"></div>
        <div class="card-corner tr"></div>
        <div class="card-corner bl"></div>
        <div class="card-corner br"></div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Share+Tech+Mono&family=Orbitron:wght@700;900&display=swap');

    :host { display: block; }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }

    @keyframes flicker {
      0%, 100% { opacity: 1; }
      92% { opacity: 1; }
      93% { opacity: 0.6; }
      94% { opacity: 1; }
    }

    @keyframes ringPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.3); opacity: 0; }
    }

    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(-45deg, #080008, #0a0000, #000510, #080008, #0a0005);
      background-size: 400% 400%;
      animation: gradientShift 10s ease infinite;
      font-family: 'Rajdhani', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .glow-red {
      position: absolute;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%);
      bottom: -100px; right: -100px;
      animation: pulse 4s ease-in-out infinite;
      pointer-events: none;
    }

    .glow-blue {
      position: absolute;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(30,64,175,0.12) 0%, transparent 70%);
      top: -80px; left: -80px;
      animation: pulse 5s ease-in-out infinite 1s;
      pointer-events: none;
    }

    .auth-card {
      position: relative;
      width: 100%;
      max-width: 440px;
      background: rgba(8,8,12,0.92);
      border: 1px solid rgba(220,38,38,0.3);
      border-radius: 4px;
      padding: 48px 40px;
      box-shadow: 0 0 40px rgba(220,38,38,0.08), 0 0 80px rgba(0,0,0,0.8);
      backdrop-filter: blur(20px);
      animation: flicker 8s infinite;
      z-index: 2;
    }

    .card-accent {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #dc2626, #ef4444, #dc2626, transparent);
    }

    .card-corner {
      position: absolute;
      width: 12px; height: 12px;
      border-color: #dc2626;
      border-style: solid;
    }

    .tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
    .tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
    .bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
    .br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

    .brand { text-align: center; margin-bottom: 36px; }
    .lock-wrap { position: relative; display: inline-block; margin-bottom: 14px; }

    .lock-icon {
      font-size: 44px;
      display: block;
      filter: drop-shadow(0 0 20px rgba(220,38,38,0.8));
    }

    .lock-ring {
      position: absolute;
      inset: -8px;
      border: 1px solid rgba(220,38,38,0.4);
      border-radius: 50%;
      animation: ringPulse 2s ease-out infinite;
    }

    h1 {
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      font-size: 28px;
      color: #fff;
      margin: 0 0 8px;
      letter-spacing: 4px;
    }

    .red { color: #dc2626; text-shadow: 0 0 20px rgba(220,38,38,0.6); }

    .tagline {
      font-family: 'Share Tech Mono', monospace;
      color: rgba(220,38,38,0.6);
      font-size: 11px;
      letter-spacing: 3px;
      margin: 0;
    }

    .field { margin-bottom: 18px; }

    label {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      color: rgba(220,38,38,0.7);
      letter-spacing: 2px;
      margin-bottom: 8px;
    }

    .lb { color: rgba(255,255,255,0.3); }
    .input-wrap { position: relative; display: flex; align-items: center; }

    .input-icon {
      position: absolute;
      left: 14px;
      font-size: 14px;
      opacity: 0.4;
      pointer-events: none;
    }

    input {
      width: 100%;
      background: rgba(220,38,38,0.03);
      border: 1px solid rgba(220,38,38,0.2);
      border-radius: 2px;
      padding: 12px 40px 12px 40px;
      color: #fff;
      font-family: 'Share Tech Mono', monospace;
      font-size: 14px;
      transition: all 0.2s;
      box-sizing: border-box;
      letter-spacing: 1px;
    }

    input:focus {
      outline: none;
      border-color: #dc2626;
      background: rgba(220,38,38,0.06);
      box-shadow: 0 0 16px rgba(220,38,38,0.15);
    }

    input::placeholder { color: rgba(255,255,255,0.15); }

    .toggle-pw {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.4);
      padding: 0;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }

    .toggle-pw:hover { color: #f87171; }

    .error {
      display: block;
      font-family: 'Share Tech Mono', monospace;
      color: #f87171;
      font-size: 11px;
      margin-top: 6px;
      letter-spacing: 1px;
    }

    .alert-error {
      background: rgba(220,38,38,0.08);
      border: 1px solid rgba(220,38,38,0.3);
      border-left: 3px solid #dc2626;
      color: #f87171;
      border-radius: 2px;
      padding: 10px 14px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 12px;
      margin-bottom: 20px;
      letter-spacing: 1px;
    }

    .submit-btn {
      width: 100%;
      background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
      color: #fff;
      border: 1px solid rgba(220,38,38,0.5);
      border-radius: 2px;
      padding: 14px 20px;
      font-family: 'Orbitron', monospace;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 3px;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      position: relative;
      overflow: hidden;
    }

    .submit-btn::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
      transition: left 0.4s;
    }

    .submit-btn:hover::before { left: 100%; }
    .submit-btn:hover { box-shadow: 0 0 24px rgba(220,38,38,0.4); transform: translateY(-1px); }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .btn-arrow { font-size: 12px; opacity: 0.7; }

    .switch-link {
      text-align: center;
      margin-top: 28px;
      font-family: 'Share Tech Mono', monospace;
      color: rgba(255,255,255,0.2);
      font-size: 11px;
      letter-spacing: 2px;
    }

    .switch-link a {
      color: #dc2626;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }

    .switch-link a:hover { color: #f87171; text-shadow: 0 0 10px rgba(220,38,38,0.5); }

    .bg-video {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      filter: brightness(0.25);
      z-index: 0;
      pointer-events: none;
    }

    .glow-red, .glow-blue { z-index: 1; }
  `],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = signal(false);
  errorMsg = signal('');
  showPassword = signal(false); // 👈 added

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');
    this.auth.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/verify'], { queryParams: { email: this.form.value.email } }),
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      },
    });
  }
}