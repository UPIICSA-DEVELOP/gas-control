/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {ResetPassRouterService} from '@app/ui/reset-pass/pages/reset-pass/reset-pass-router.service';
import {ResetPassComponent} from '@app/ui/reset-pass/pages/reset-pass/reset-pass.component';
const URL_BASE = environment.url;

export const resetPassRoutes: Routes = [
  {
    path: '',
    canActivate: [ResetPassRouterService],
    component: ResetPassComponent,
    data:{
      title: 'Recuperar Contraseña',
      url: URL_BASE + 'signin'
    }
  }
];

