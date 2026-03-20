import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.RegisterComponent),
  },
  {
    path: 'verify',
    loadComponent: () =>
      import('./pages/verify/verify').then(m => m.VerifyComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'gear/add',
    loadComponent: () =>
      import('./pages/gear-add/gear-add').then(m => m.GearAddComponent),
    canActivate: [authGuard],
  },
  {
    path: 'gear/:id',
    loadComponent: () =>
      import('./pages/gear-detail/gear-detail').then(m => m.GearDetailComponent),
    canActivate: [authGuard],
  },
  {
    path: 'gear/:id/edit',
    loadComponent: () =>
      import('./pages/gear-edit/gear-edit').then(m => m.GearEditComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings').then(m => m.SettingsComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/login' },
];