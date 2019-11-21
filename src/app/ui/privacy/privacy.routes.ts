/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {PrivacyComponent} from '@app/ui/privacy/pages/privacy/privacy.component';

const URL_BASE = environment.url;

export const privacyRoutes: Routes = [
  {
    path: '',
    component: PrivacyComponent,
    data: {
      title: 'Privacidad',
      url: URL_BASE + 'privacidad',
      robots: 'true',
      canonical: 'true'
    }
  }
];

