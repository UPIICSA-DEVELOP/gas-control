/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {ScreenComponent} from '@app/components/screen/screen.component';
import {LoginComponent} from '@app/components/login/login.component';
import {AuthService} from '@app/core/services/auth/auth.service';
const URL_BASE = environment.url;

export const appRoutes: Routes = [
  {
    path: 'home',
    component: ScreenComponent,
    data: {
      url: URL_BASE + 'home'
    }
  },
  {
    path: '',
    component: LoginComponent,
    data: {
      url: URL_BASE
    }
  }
];

