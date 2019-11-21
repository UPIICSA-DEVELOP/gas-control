/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login'
  },
  {
    path: 'login',
    loadChildren: () => import('app/ui/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('app/ui/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('app/ui/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('app/ui/reset-pass/reset-pass.module').then(m => m.ResetPassModule)
  },
  {
    path: 'privacidad',
    loadChildren: () => import('app/ui/privacy/privacy.module').then(m => m.PrivacyModule)
  },
  {
    path: 'terminos',
    loadChildren: () => import('app/ui/terms/terms.module').then(m => m.TermsModule)
  },
  {
    path: 'cookies',
    loadChildren: () => import('app/ui/cookies/cookies.module').then(m => m.CookiesModule)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

