import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'techlocker_token';
  private readonly USER_KEY = 'techlocker_user';
  private apiUrl = 'https://techlocker-backend.onrender.com/api/auth';

  currentUser = signal<User | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { username: string; email: string; password: string }) {
    return this.http.post<{ message: string; email: string }>(
      `${this.apiUrl}/register`, data
    );
  }

  verify(data: { email: string; code: string }) {
    return this.http.post<{ token: string; user: User }>(
      `${this.apiUrl}/verify`, data
    ).pipe(
      tap(res => this.storeSession(res.token, res.user))
    );
  }

  resendCode(email: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/resend-code`, { email }
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string; user: User }>(
      `${this.apiUrl}/login`, data
    ).pipe(
      tap(res => this.storeSession(res.token, res.user))
    );
  }

  updateProfile(data: { username: string }) {
    return this.http.put<{ user: User }>(
      `${this.apiUrl}/profile`,
      data,
      { headers: { Authorization: `Bearer ${this.getToken()}` } }
    ).pipe(
      tap(res => {
        const current = this.currentUser();
        if (current) this.storeSession(this.getToken()!, res.user);
      })
    );
  }

  // 👇 Step 1 — request email change, sends code to current email
  requestEmailChange(newEmail: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/request-email-change`,
      { newEmail },
      { headers: { Authorization: `Bearer ${this.getToken()}` } }
    );
  }

  // 👇 Step 2 — confirm with code, applies new email
  confirmEmailChange(code: string) {
    return this.http.post<{ message: string; user: User }>(
      `${this.apiUrl}/confirm-email-change`,
      { code },
      { headers: { Authorization: `Bearer ${this.getToken()}` } }
    ).pipe(
      tap(res => {
        const token = this.getToken();
        if (token) this.storeSession(token, res.user);
      })
    );
  }

  changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/password`,
      data,
      { headers: { Authorization: `Bearer ${this.getToken()}` } }
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private storeSession(token: string, user: User) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}