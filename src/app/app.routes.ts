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
import {ProfileComponent} from '@app/components/screen/components/profiles/profile/profile.component';
import {NotificationsComponent} from '@app/components/screen/components/notifications/notifications.component';
import {CollaboratorsListComponent} from '@app/components/screen/components/collaborators-list/collaborators-list.component';
import {UserProfileComponent} from '@app/components/screen/components/profiles/user-profile/user-profile.component';
import {StationProfileComponent} from '@app/components/screen/components/profiles/station-profile/station-profile.component';
import {DirectoryListComponent} from '@app/components/screen/components/directory-list/directory-list.component';
import {StationListComponent} from '@app/components/screen/components/station-list/station-list.component';
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
        resolve: {data: AuthService},
        children:[
          {
            path: 'consultancy',
            component: ProfileComponent,
          },
          {
            path: 'user',
            component: UserProfileComponent
          },
          {
            path: 'gas-station',
            component: StationProfileComponent
          },
        ]
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        resolve: {data: AuthService},
      },
      {
        path:'collaborators',
        resolve: {data: AuthService},
        data:{
          title: 'Colaboradores',
          url: URL_BASE + 'home/collaborators'
        },
        children:[
          {
            path:'consultancy',
            component: CollaboratorsListComponent
          }
        ]
      },
      {
        path:'station-list',
        component: StationListComponent,
        data:{
          title: 'Lista de estaciones',
          url: URL_BASE + 'home/station-list'
        }
      },
      {
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

