/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {CookiesComponent} from '@app/ui/cookies/pages/cookies/cookies.component';
const URL_BASE = environment.url;

export const cookiesRoutes: Routes = [
  {
    path: '',
    component: CookiesComponent,
    data:{
      title:'Política de Cookies',
      url: URL_BASE + 'cookies',
      robots: 'true',
      canonical: 'true'
    }
  }
];

