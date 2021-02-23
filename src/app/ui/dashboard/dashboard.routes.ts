/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 *
 */

import {Routes} from '@angular/router';
import {environment} from '@env/environment';
import {AuthRouterService} from '@app/core/services/auth/auth-router.service';
import {AuthService} from '@app/core/services/auth/auth.service';
import {DashboardComponent} from '@app/ui/dashboard/pages/dashboard/dashboard.component';
import {DocumentationComponent} from '@app/ui/dashboard/pages/documentation/documentation.component';
import {DocumentationService} from '@app/ui/dashboard/pages/documentation/documentation.service';
import {NotificationsComponent} from '@app/ui/dashboard/pages/notifications/notifications.component';
import {CollaboratorsListComponent} from '@app/ui/dashboard/pages/collaborators-list/collaborators-list.component';
import {StationListComponent} from '@app/ui/dashboard/pages/station-list/station-list.component';
import {AddCollaboratorComponent} from '@app/ui/dashboard/pages/add-collaborator/add-collaborator.component';
import {ProceduresComponent} from '@app/ui/dashboard/pages/procedures/procedures.component';
import {ProfileComponent} from '@app/ui/dashboard/pages/profiles/profile/profile.component';
import {ProfileService} from '@app/ui/dashboard/pages/profiles/profile/profile.service';
import {UserProfileComponent} from '@app/ui/dashboard/pages/profiles/user-profile/user-profile.component';
import {UserProfileService} from '@app/ui/dashboard/pages/profiles/user-profile/user-profile.service';
import {StationProfileComponent} from '@app/ui/dashboard/pages/profiles/station-profile/station-profile.component';
import {StationProfileService} from '@app/ui/dashboard/pages/profiles/station-profile/station-profile.service';
import {ArchiveComponent} from '@app/ui/dashboard/pages/archive/archive.component';

const URL_BASE = environment.url;

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthRouterService],
    resolve: {data: AuthService},
    data: {
      url: URL_BASE + 'home',
      title: 'Dashboard'
    },
    children: [
      {
        path: 'documents/:station',
        component: DocumentationComponent,
        resolve: {data: DocumentationService},
        data: {
          title: 'Documentación',
          url: URL_BASE + 'home/documents'
        }
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        data: {
          title: 'Notificaciones',
          url: URL_BASE + 'home/notifications'
        }
      },
      {
        path: 'collaborators',
        component: CollaboratorsListComponent,
        data: {
          title: 'Colaboradores',
          url: URL_BASE + 'home/collaborators'
        }
      },
      {
        path: 'station-list',
        component: StationListComponent,
        data: {
          title: 'Lista de estaciones',
          url: URL_BASE + 'home/station-list'
        }
      },
      {
        path: 'add-collaborator',
        component: AddCollaboratorComponent,
        data: {
          url: URL_BASE + 'home/add-collaborator',
          title: 'Añadir colaborador'
        }
      },
      {
        path: 'procedures',
        component: ProceduresComponent,
        data: {
          title: 'Procedimientos',
          url: URL_BASE + 'home/procedures'
        }
      },
      {
        path: 'profile',
        data: {
          url: URL_BASE + 'home/profile',
          title: 'Perfil'
        },
        children: [
          {
            path: 'consultancy',
            component: ProfileComponent,
            data: {
              title: 'Perfil',
              url: URL_BASE + 'home/profile/consultancy'
            },
            resolve: {data: ProfileService}
          },
          {
            path: 'user',
            component: UserProfileComponent,
            resolve: {data: UserProfileService},
            data: {
              title: 'Perfil',
              url: URL_BASE + 'home/profile/user'
            }
          },
          {
            path: 'gas-station/:id',
            component: StationProfileComponent,
            resolve: {data: StationProfileService},
            data: {
              title: 'Estación de servicio',
              url: URL_BASE + 'home/profile/gas-station'
            }
          }
        ]
      },
      {
        path: 'archive/:stationId',
        component: ArchiveComponent,
        data: {
          title: 'Archivo de tareas',
          url: URL_BASE + 'home/archive'
        }
      }
    ]
  }
];

