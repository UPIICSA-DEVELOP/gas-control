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
import {ResetPassService} from '@app/core/services/reset-pass/reset-pass.service';
import {ResetPassComponent} from '@app/components/screen/child/reset-pass/reset-pass.component';
import {ProfileComponent} from '@app/components/screen/components/profile/profile.component';
const URL_BASE = environment.url;

export const appRoutes: Routes = [
  {
    path: 'home',
    component: ScreenComponent,
    resolve: {data: AuthService},
    data: {
      url: URL_BASE + 'home',
      title:'inSpector'
    },
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        resolve: {data: AuthService},
        data: {
          title:'Perfil',
          url: URL_BASE + 'home/profile'
        }
      },{
        path: 'updatepassword',
        component: ResetPassComponent
      }
    ]
  },
  {
    path: '',
    component: LoginComponent,
    resolve: {data: AuthService},
    data: {
      title:'inSpector',
      url: URL_BASE,
      robots: 'true',
      schema: 'true',
      canonical: 'true'
    }
  },
  {
    path: 'signin',
    component: ResetPassComponent,
    resolve: {data: ResetPassService},
    data:{
      title:'inSpector',
      url: URL_BASE + 'signin'
    }
  },
  {
    path: '**',
    redirectTo:'/home'
  }
];

