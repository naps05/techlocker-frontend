import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NavbarComponent],
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
      <h2>Settings</h2>
      <p class="subtitle">Manage your vault account</p>

      <div class="settings-grid">

        <div class="card">
          <h3>Edit Profile</h3>

          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <div class="field">
              <label>Username</label>
              <input type="text" formControlName="username" />
              @if (profileForm.get('username')?.invalid && profileForm.get('username')?.touched) {
                <span class="error">Username is required</span>
              }
            </div>

            <div class="field">
              <label>Current Email</label>
              <div class="email-display">
                <span class="email-value">{{ auth.currentUser()?.email }}</span>
                <button type="button" class="btn-change-email" (click)="toggleEmailSection()">
                  {{ showEmailSection() ? 'Cancel' : 'Change' }}
                </button>
              </div>
            </div>

            @if (profileMsg()) {
              <div class="alert-success">{{ profileMsg() }}</div>
            }
            @if (profileErr()) {
              <div class="alert-error">{{ profileErr() }}</div>
            }

            <button type="submit" [disabled]="profileLoading()">
              @if (profileLoading()) { Saving... } @else { Save Username }
            </button>
          </form>

          @if (showEmailSection()) {
            <div class="email-section">
              <div class="email-section-divider">
                <span>Change Email</span>
              </div>

              @if (!awaitingEmailCode()) {
                <div class="field">
                  <label>New Email Address</label>
                  <input
                    type="email"
                    [(ngModel)]="newEmailInput"
                    [ngModelOptions]="{standalone: true}"
                    placeholder="Enter new email"
                  />
                </div>
                @if (emailStepErr()) {
                  <div class="alert-error">{{ emailStepErr() }}</div>
                }
                <button class="btn-send-code" (click)="requestEmailChange()" [disabled]="emailStepLoading()">
                  @if (emailStepLoading()) { Sending code... } @else { Send Verification Code }
                </button>
                <p class="email-hint">A code will be sent to your <strong>current email</strong> to confirm.</p>
              }

              @if (awaitingEmailCode()) {
                <div class="verify-info">
                  <span class="verify-icon">📧</span>
                  <p>Code sent to your current email. Confirming change to:</p>
                  <p class="new-email-tag">{{ pendingEmail() }}</p>
                </div>

                <div class="field">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    [(ngModel)]="emailCode"
                    [ngModelOptions]="{standalone: true}"
                    placeholder="Enter 6-digit code"
                    maxlength="6"
                    class="code-input"
                  />
                </div>

                @if (emailCodeMsg()) {
                  <div class="alert-success">{{ emailCodeMsg() }}</div>
                }
                @if (emailCodeErr()) {
                  <div class="alert-error">{{ emailCodeErr() }}</div>
                }

                <div class="code-actions">
                  <button class="btn-back" (click)="cancelEmailChange()">Back</button>
                  <button class="btn-confirm-code" (click)="confirmEmailChange()" [disabled]="emailCodeLoading()">
                    @if (emailCodeLoading()) { Verifying... } @else { Confirm Change }
                  </button>
                </div>

                <p class="resend-link">
                  Didn't receive it? <span (click)="resendEmailCode()">Resend code</span>
                </p>
              }
            </div>
          }
        </div>

        <div class="card">
          <h3>Change Password</h3>
          <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
            <div class="field">
              <label>Current Password</label>
              <input type="password" formControlName="currentPassword" placeholder="••••••••" />
            </div>
            <div class="field">
              <label>New Password</label>
              <input type="password" formControlName="newPassword" placeholder="Min. 6 characters" />
              @if (passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched) {
                <span class="error">Min. 6 characters required</span>
              }
            </div>
            @if (passwordMsg()) {
              <div class="alert-success">{{ passwordMsg() }}</div>
            }
            @if (passwordErr()) {
              <div class="alert-error">{{ passwordErr() }}</div>
            }
            <button type="submit" [disabled]="passwordLoading()">
              @if (passwordLoading()) { Updating... } @else { Update Password }
            </button>
          </form>
        </div>

        <div class="card danger-card">
          <h3 class="danger-title">🔒 Your gear will remain safe in the vault.</h3>
          <p class="danger-desc"></p>
          <button class="btn-logout" (click)="auth.logout()">Log Out</button>
        </div>

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

    .main { max-width: 900px; margin: 0 auto; padding: 40px 32px; }
    h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; color: #fff; margin: 0 0 6px; }
    .subtitle { color: rgba(255,255,255,0.35); font-size: 14px; margin: 0 0 36px; }
    .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

    .card { background: rgba(11,11,18,0.85); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 28px; }
    h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; color: #fff; margin: 0 0 24px; }
    .field { margin-bottom: 18px; display: flex; flex-direction: column; gap: 8px; }
    label { font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.08em; }

    input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
    input:focus { outline: none; border-color: rgba(220,38,38,0.6); background: rgba(220,38,38,0.04); }

    .code-input {
      font-size: 14px !important;
      letter-spacing: 1px !important;
      text-align: left !important;
      font-family: 'DM Sans', sans-serif !important;
      background: rgba(220,38,38,0.06) !important;
      border-color: rgba(220,38,38,0.3) !important;
    }

    .code-input::placeholder {
      font-size: 13px !important;
      letter-spacing: 0px !important;
      color: rgba(255,255,255,0.2) !important;
    }

    .error { color: #f87171; font-size: 12px; }
    .alert-success { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); color: #34d399; border-radius: 8px; padding: 9px 12px; font-size: 13px; margin-bottom: 16px; }
    .alert-error { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #f87171; border-radius: 8px; padding: 9px 12px; font-size: 13px; margin-bottom: 16px; }

    button[type=submit] {
      width: 100%;
      background: #dc2626;
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 12px;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button[type=submit]:hover:not(:disabled) { background: #b91c1c; }
    button[type=submit]:disabled { opacity: 0.5; cursor: not-allowed; }

    .email-display {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 11px 14px;
    }

    .email-value {
      color: rgba(255,255,255,0.6);
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-change-email {
      background: rgba(220,38,38,0.15);
      color: #f87171;
      border: 1px solid rgba(220,38,38,0.25);
      border-radius: 6px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      margin-left: 10px;
      transition: all 0.2s;
      font-family: 'DM Sans', sans-serif;
    }

    .btn-change-email:hover { background: rgba(220,38,38,0.25); }

    .email-section {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255,255,255,0.06);
      animation: slideDown 0.2s ease;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .email-section-divider {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
    }

    .email-section-divider span {
      font-family: 'Syne', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: rgba(255,255,255,0.4);
      white-space: nowrap;
    }

    .email-hint {
      font-size: 12px;
      color: rgba(255,255,255,0.25);
      margin: 10px 0 0;
      line-height: 1.5;
    }

    .email-hint strong { color: rgba(255,255,255,0.45); }

    .btn-send-code {
      width: 100%;
      background: rgba(220,38,38,0.15);
      color: #f87171;
      border: 1px solid rgba(220,38,38,0.25);
      border-radius: 10px;
      padding: 11px;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-send-code:hover:not(:disabled) { background: rgba(220,38,38,0.25); }
    .btn-send-code:disabled { opacity: 0.5; cursor: not-allowed; }

    .verify-info {
      background: rgba(220,38,38,0.06);
      border: 1px solid rgba(220,38,38,0.2);
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      margin-bottom: 16px;
    }

    .verify-icon { font-size: 28px; display: block; margin-bottom: 8px; }

    .verify-info p {
      color: rgba(255,255,255,0.5);
      font-size: 13px;
      margin: 0 0 8px;
      line-height: 1.5;
    }

    .new-email-tag {
      color: #f87171 !important;
      font-weight: 600 !important;
      font-size: 14px !important;
      background: rgba(220,38,38,0.1);
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
    }

    .code-actions { display: flex; gap: 10px; margin-bottom: 12px; }

    .btn-back {
      flex: 1;
      background: rgba(255,255,255,0.05);
      color: rgba(255,255,255,0.5);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 11px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-back:hover { background: rgba(255,255,255,0.09); color: #fff; }

    .btn-confirm-code {
      flex: 2;
      background: #dc2626;
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 11px;
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-confirm-code:hover:not(:disabled) { background: #b91c1c; }
    .btn-confirm-code:disabled { opacity: 0.5; cursor: not-allowed; }

    .resend-link { text-align: center; font-size: 12px; color: rgba(255,255,255,0.25); margin: 0; }
    .resend-link span { color: #f87171; cursor: pointer; text-decoration: underline; }
    .resend-link span:hover { color: #fca5a5; }

    .danger-card { border-color: rgba(248,113,113,0.15); grid-column: 1 / -1; display: flex; align-items: center; gap: 24px; }
    .danger-title { color: #f87171; margin: 0; }
    .danger-desc { color: rgba(255,255,255,0.35); font-size: 13px; margin: 0; flex: 1; }
    .btn-logout { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.25); border-radius: 10px; padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
    .btn-logout:hover { background: rgba(248,113,113,0.2); }

    @media (max-width: 640px) { .settings-grid { grid-template-columns: 1fr; } .danger-card { flex-direction: column; align-items: flex-start; } }
  `],
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);
  theme = inject(ThemeService);

  profileForm = this.fb.group({
    username: [this.auth.currentUser()?.username || '', Validators.required],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  profileLoading = signal(false);
  profileMsg = signal('');
  profileErr = signal('');

  showEmailSection = signal(false);
  awaitingEmailCode = signal(false);
  newEmailInput = '';
  pendingEmail = signal('');
  emailCode = '';
  emailStepLoading = signal(false);
  emailStepErr = signal('');
  emailCodeLoading = signal(false);
  emailCodeMsg = signal('');
  emailCodeErr = signal('');

  passwordLoading = signal(false);
  passwordMsg = signal('');
  passwordErr = signal('');

  toggleEmailSection() {
    this.showEmailSection.update(v => !v);
    if (!this.showEmailSection()) {
      this.awaitingEmailCode.set(false);
      this.newEmailInput = '';
      this.emailCode = '';
      this.emailStepErr.set('');
      this.emailCodeErr.set('');
      this.emailCodeMsg.set('');
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.profileLoading.set(true);
    this.profileErr.set('');
    this.profileMsg.set('');

    this.auth.updateProfile({ username: this.profileForm.value.username! }).subscribe({
      next: () => {
        this.profileMsg.set('Username updated successfully!');
        this.profileLoading.set(false);
        setTimeout(() => this.profileMsg.set(''), 3000);
      },
      error: (err) => {
        this.profileErr.set(err.error?.message || 'Failed to update username.');
        this.profileLoading.set(false);
      }
    });
  }

  requestEmailChange() {
    if (!this.newEmailInput || !this.newEmailInput.includes('@')) {
      this.emailStepErr.set('Please enter a valid email address.');
      return;
    }
    this.emailStepLoading.set(true);
    this.emailStepErr.set('');

    this.auth.requestEmailChange(this.newEmailInput).subscribe({
      next: () => {
        this.pendingEmail.set(this.newEmailInput);
        this.awaitingEmailCode.set(true);
        this.emailStepLoading.set(false);
      },
      error: (err) => {
        this.emailStepErr.set(err.error?.message || 'Failed to send verification code.');
        this.emailStepLoading.set(false);
      }
    });
  }

  confirmEmailChange() {
    if (!this.emailCode || this.emailCode.length < 6) {
      this.emailCodeErr.set('Please enter the 6-digit code.');
      return;
    }
    this.emailCodeLoading.set(true);
    this.emailCodeErr.set('');

    this.auth.confirmEmailChange(this.emailCode).subscribe({
      next: () => {
        this.emailCodeMsg.set('Email updated successfully!');
        this.emailCodeLoading.set(false);
        this.showEmailSection.set(false);
        this.awaitingEmailCode.set(false);
        this.newEmailInput = '';
        this.emailCode = '';
        setTimeout(() => this.emailCodeMsg.set(''), 3000);
      },
      error: (err) => {
        this.emailCodeErr.set(err.error?.message || 'Invalid code. Please try again.');
        this.emailCodeLoading.set(false);
      }
    });
  }

  cancelEmailChange() {
    this.awaitingEmailCode.set(false);
    this.emailCode = '';
    this.emailCodeErr.set('');
    this.newEmailInput = '';
  }

  resendEmailCode() {
    this.auth.requestEmailChange(this.pendingEmail()).subscribe({
      next: () => {
        this.emailCodeErr.set('');
        this.emailCodeMsg.set('New code sent!');
        setTimeout(() => this.emailCodeMsg.set(''), 3000);
      },
      error: (err) => {
        this.emailCodeErr.set(err.error?.message || 'Failed to resend code.');
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.passwordLoading.set(true);
    this.passwordErr.set('');
    this.auth.changePassword(this.passwordForm.value as any).subscribe({
      next: () => {
        this.passwordMsg.set('Password updated!');
        this.passwordForm.reset();
        this.passwordLoading.set(false);
        setTimeout(() => this.passwordMsg.set(''), 3000);
      },
      error: (err) => {
        this.passwordErr.set(err.error?.message || 'Failed to update password.');
        this.passwordLoading.set(false);
      },
    });
  }
}