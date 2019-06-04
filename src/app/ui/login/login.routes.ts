/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {AuthRouterService} from '@app/core/services/auth/auth-router.service';
import {LoginComponent} from '@app/ui/login/pages/login/login.component';
const URL_BASE = environment.url;

export const loginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [AuthRouterService],
    data: {
      title:'inSpéctor - Iniciar sesión',
      url: URL_BASE,
    }
  }
];

