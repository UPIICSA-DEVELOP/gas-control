/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {AdminComponent} from '@app/ui/admin/pages/admin/admin.component';
import {AuthRouterService} from '@app/core/services/auth/auth-router.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {AdminNotificationsComponent} from '@app/ui/admin/pages/admin-notifications/admin-notifications.component';
const URL_BASE = environment.url;

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthRouterService],
    resolve: {data: AuthService},
    data: {
      title:'Administrador',
      url: URL_BASE
    },
    children: [
      {
        path: 'notifications',
        component: AdminNotificationsComponent,
        data: {
          title: 'Notificaciones',
          url: URL_BASE + 'admin/notifications'
        }
      }
    ]
  }
];

