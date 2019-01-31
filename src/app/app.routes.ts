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
import {StationListComponent} from '@app/components/screen/components/station-list/station-list.component';
import {AddCollaboratorComponent} from '@app/components/screen/components/add-collaborator/add-collaborator.component';
import {DocumentationComponent} from '@app/components/screen/components/documentation/documentation.component';
import {AddGasStationComponent} from '@app/components/screen/components/add-gas-station/add-gas-station.component';
import {ProceduresComponent} from '@app/components/screen/components/procedures/procedures.component';
import {UserProfileService} from '@app/core/services/profiles/user-profile.service';
import {PrivacyComponent} from '@app/components/screen/child/privacy/privacy.component';
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
        path:'documents',
        component: DocumentationComponent,
        resolve: {data: AuthService},
        data:{
          title: 'Documentación',
          url: URL_BASE + 'home/documents'
        }
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        resolve: {data: AuthService},
        data:{
          title: 'Notificaciones',
          url: URL_BASE + 'home/notifications'
        }
      },
      {
        path:'collaborators',
        resolve: {data: AuthService},
        component: CollaboratorsListComponent,
        data:{
          title: 'Colaboradores',
          url: URL_BASE + 'home/collaborators'
        }
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
      },
      {
        path: 'add-collaborator',
        component: AddCollaboratorComponent,
        data:{
          url: URL_BASE + 'home/add-collaborator',
          title: 'Añadir colaborador'
        }
      },
      {
        path: 'procedures',
        component: ProceduresComponent,
        resolve: {data: AuthService},
        data:{
          title: 'Procedimientos',
          url: URL_BASE + 'home/procedures'
        }
      },
    ]
  },
  {
    path: 'profile',
    resolve: {data: AuthService},
    data:{
      url: URL_BASE + 'profile',
      title: 'Perfil'
    },
    children:[
      {
        path: 'consultancy',
        component: ProfileComponent,
        data:{
          title: 'Perfil',
          url: URL_BASE + '/profile/consultancy'
        }
      },
      {
        path: 'user',
        component: UserProfileComponent,
        resolve: {data: UserProfileService},
        data:{
          title: 'Perfil',
          url: URL_BASE + '/profile/user'
        }
      },
      {
        path: 'gas-station',
        component: StationProfileComponent,
        data:{
          title: 'Estación de servicio',
          url: URL_BASE + '/profile/gas-station'
        }
      }
    ]
  },
  {
    path: 'add-station',
    component: AddGasStationComponent,
    resolve: {data: AuthService},
    data:{
      url: URL_BASE+'add-station',
      title: 'Agregar estación'
    }
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
      title:'inSpector'
    }
  },
  {
    path: 'privacidad',
    component: PrivacyComponent,
    resolve:{data: AuthService},
    data:{
      title:'Privacidad',
      url: URL_BASE + 'privacidad',
      robots: 'true',
      canonical: 'true'
    }
  },
  {
    path: '**',
    redirectTo:'/home'
  }
];

