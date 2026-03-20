import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="bg-grid"></div>
      <div class="glow-red"></div>
      <div class="glow-blue"></div>

      <div class="auth-card">
        <div class="card-accent"></div>

        <div class="brand">
          <div class="lock-wrap">
            <span class="lock-icon">📧</span>
            <div class="lock-ring"></div>
          </div>
          <h1>TECH<span class="red">LOCKER</span></h1>
          <p class="tagline">// VERIFY YOUR VAULT //</p>
        </div>

        <p class="info-text">
          A 6-digit verification code was sent to<br>
          <span class="email-highlight">{{ email() }}</span>
        </p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label><span class="lb">[</span> VERIFICATION CODE <span class="lb">]</span></label>
            <div class="input-wrap">
              <span class="input-icon">🔑</span>
              <input
                type="text"
                formControlName="code"
                placeholder="Enter 6-digit code"
                maxlength="6"
              />
            </div>
            @if (form.get('code')?.invalid && form.get('code')?.touched) {
              <span class="error">⚠ 6-digit code is required</span>
            }
          </div>

          @if (errorMsg()) {
            <div class="alert-error">⚠ {{ errorMsg() }}</div>
          }

          @if (successMsg()) {
            <div class="alert-success">✅ {{ successMsg() }}</div>
          }

          <button type="submit" [disabled]="loading()" class="submit-btn">
            <span>@if (loading()) { VERIFYING... } @else { VERIFY ACCOUNT }</span>
            <span class="btn-arrow">▶</span>
          </button>
        </form>

        <p class="resend-link">
          Didn't receive the code?
          <a (click)="resendCode()" class="resend-btn">Resend Code</a>
        </p>

        <p class="switch-link">
          <a routerLink="/login">← Back to Login</a>
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

    .bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(220,38,38,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(220,38,38,0.05) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }

    .glow-red {
      position: absolute;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%);
      top: -100px; left: -100px;
      animation: pulse 4s ease-in-out infinite;
      pointer-events: none;
    }

    .glow-blue {
      position: absolute;
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(30,64,175,0.12) 0%, transparent 70%);
      bottom: -80px; right: -80px;
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
      z-index: 1;
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

    .brand { text-align: center; margin-bottom: 28px; }

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

    .info-text {
      font-family: 'Share Tech Mono', monospace;
      color: rgba(255,255,255,0.4);
      font-size: 12px;
      text-align: center;
      margin-bottom: 28px;
      line-height: 1.8;
      letter-spacing: 1px;
    }

    .email-highlight {
      color: #f87171;
      font-weight: bold;
    }

    .field { margin-bottom: 20px; }

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
      padding: 14px 16px 14px 40px;
      color: #fff;
      font-family: 'Orbitron', monospace;
      font-size: 20px;
      letter-spacing: 8px;
      transition: all 0.2s;
      box-sizing: border-box;
      text-align: center;
    }

    input:focus {
      outline: none;
      border-color: #dc2626;
      background: rgba(220,38,38,0.06);
      box-shadow: 0 0 16px rgba(220,38,38,0.15);
    }

    input::placeholder { color: rgba(255,255,255,0.15); font-size: 13px; letter-spacing: 2px; }

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

    .alert-success {
      background: rgba(34,197,94,0.08);
      border: 1px solid rgba(34,197,94,0.3);
      border-left: 3px solid #22c55e;
      color: #22c55e;
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

    .resend-link {
      text-align: center;
      margin-top: 20px;
      font-family: 'Share Tech Mono', monospace;
      color: rgba(255,255,255,0.2);
      font-size: 11px;
      letter-spacing: 1px;
    }

    .resend-btn {
      color: #dc2626;
      cursor: pointer;
      text-decoration: none;
      font-weight: 600;
      margin-left: 6px;
      transition: all 0.2s;
    }

    .resend-btn:hover { color: #f87171; }

    .switch-link {
      text-align: center;
      margin-top: 16px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      letter-spacing: 1px;
    }

    .switch-link a { color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.2s; }
    .switch-link a:hover { color: #f87171; }
  `],
})
export class VerifyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  email = signal('');
  loading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  form = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.email.set(email);
    } else {
      this.router.navigate(['/register']);
    }
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.errorMsg.set('');

    this.http.post<any>('http://localhost:3000/api/auth/verify', {
      email: this.email(),
      code: this.form.value.code
    }).subscribe({
      next: (res) => {
        localStorage.setItem('techlocker_token', res.token);
        localStorage.setItem('techlocker_user', JSON.stringify(res.user));
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Verification failed.');
        this.loading.set(false);
      }
    });
  }

  resendCode() {
    this.errorMsg.set('');
    this.successMsg.set('');
    this.http.post<any>('http://localhost:3000/api/auth/resend-code', {
      email: this.email()
    }).subscribe({
      next: () => {
        this.successMsg.set('New code sent to your email!');
        setTimeout(() => this.successMsg.set(''), 4000);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Failed to resend code.');
      }
    });
  }
}