/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {TermsComponent} from '@app/ui/terms/pages/terms/terms.component';
import {AuthRouterService} from '@app/core/services/auth/auth-router.service';
const URL_BASE = environment.url;

export const termsRoutes: Routes = [
  {
    path: '',
    component: TermsComponent,
    canActivate: [AuthRouterService],
    data:{
      title:'Términos y Condiciones',
      url: URL_BASE + 'terminos',
      robots: 'true',
      canonical: 'true'
    }
  }
];

