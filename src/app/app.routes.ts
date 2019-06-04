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
    redirectTo:'/login'
  },
  {
    path: 'login',
    loadChildren: 'app/ui/login/login.module#LoginModule'
  },
  {
    path: 'home',
    loadChildren: 'app/ui/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/ui/admin/admin.module#AdminModule'
  },
  {
    path: 'signin',
    loadChildren: 'app/ui/reset-pass/reset-pass.module#ResetPassModule'
  },
  {
    path: 'privacidad',
    loadChildren: 'app/ui/privacy/privacy.module#PrivacyModule'
  },
  {
    path: 'terminos',
    loadChildren: 'app/ui/terms/terms.module#TermsModule'
  },
  {
    path: 'cookies',
    loadChildren: 'app/ui/cookies/cookies.module#CookiesModule'
  },
  {
    path: '**',
    redirectTo:'/login'
  }
];

